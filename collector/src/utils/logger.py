import datetime

class Logger:
    def __init__(self, resource) -> None:
        self.resource = resource
        self.log_level_map = {
            "INFO":     "\033[92m[INFO]\033[0m",
            "WARNING":  "\033[93m[WARNING]\033[0m",
            "ERROR":    "\033[91m[ERROR]\033[0m",
        }
        self.log_level = None


    def set_log_level(self, level):
        self.log_level = self.log_level_map[level]
        return self

    def log_warning(self, message: str):
        self.set_log_level("WARNING").log(message)

    def log_error(self, message: str):
        self.set_log_level("ERROR").log(message)
        
    def log_info(self, message: str):
        self.set_log_level("INFO").log(message)

    def log(self, message: str):
        iso_8651_datetime = datetime.datetime.now().isoformat(sep=" ")
        print(f"{iso_8651_datetime} | [{self.resource}] | {self.log_level} - {message}")
