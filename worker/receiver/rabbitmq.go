package receiver

import (
	"fmt"
	"log"

	amqp "github.com/rabbitmq/amqp091-go"
)

type MessageHandler func(body []byte) error

type RabbitMQReceiver struct {
	url       string
	queueName string
	conn      *amqp.Connection
	channel   *amqp.Channel
	handler   MessageHandler
}

func NewRabbitMQReceiver(url, queueName string) *RabbitMQReceiver {
	return &RabbitMQReceiver{
		url:       url,
		queueName: queueName,
	}
}

func (r *RabbitMQReceiver) SetHandler(handler MessageHandler) {
	r.handler = handler
}

func (r *RabbitMQReceiver) Start() error {
	var err error

	// Connect to RabbitMQ
	r.conn, err = amqp.Dial(r.url)
	if err != nil {
		return fmt.Errorf("failed to connect to RabbitMQ: %w", err)
	}
	defer r.conn.Close()

	// Open a channel
	r.channel, err = r.conn.Channel()
	if err != nil {
		return fmt.Errorf("failed to open channel: %w", err)
	}
	defer r.channel.Close()

	// Declare queue
	queue, err := r.channel.QueueDeclare(
		r.queueName, // name
		false,        // durable
		false,       // delete when unused
		false,       // exclusive
		false,       // no-wait
		nil,         // arguments
	)
	if err != nil {
		return fmt.Errorf("failed to declare queue: %w", err)
	}

	// Set QoS to process one message at a time
	err = r.channel.Qos(
		1,     // prefetch count
		0,     // prefetch size
		false, // global
	)
	if err != nil {
		return fmt.Errorf("failed to set QoS: %w", err)
	}

	// Start consuming messages
	msgs, err := r.channel.Consume(
		queue.Name, // queue
		"",         // consumer
		false,      // auto-ack (disabled for manual ack)
		false,      // exclusive
		false,      // no-local
		false,      // no-wait
		nil,        // args
	)
	if err != nil {
		return fmt.Errorf("failed to register consumer: %w", err)
	}

	// Handle connection close notifications
	closeChan := make(chan *amqp.Error)
	r.conn.NotifyClose(closeChan)

	// Process messages
	forever := make(chan bool)

	go func() {
		for d := range msgs {
			if r.handler != nil {
				if err := r.handler(d.Body); err != nil {
					log.Printf("Error processing message: %v", err)
					// Negative acknowledgment - requeue the message
					d.Nack(false, true)
				} else {
					log.Printf("Successfully processed message")
					// Positive acknowledgment
					d.Ack(false)
				}
			} else {
				log.Printf("No handler set, skipping message: %s", d.Body)
				d.Ack(false)
			}
		}
	}()

	// Handle connection errors
	go func() {
		err := <-closeChan
		if err != nil {
			log.Printf("Connection closed: %v", err)
		}
		close(forever)
	}()

	<-forever
	return nil
}

