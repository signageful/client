# Signageful Client

This project consists of various daemons referred to as "player" and "sig-monitor".

- [Signageful Client](#signageful-client)
  - [player](#player)
  - [sig-monitor](#sig-monitor)
- [Getting Started](#getting-started)
  - [`sig-monitor`](#sig-monitor-1)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)


## player

The "player" is an Electron process built with electron-forge. It retrieves the playlist and displays it on the connected monitor using Wayland.

## sig-monitor
The "sig-monitor" is a Go project that regularly retrieves system data such as CPU temperature, RAM, etc.

# Getting Started

To get started with this project, please refer to the subdirectories for "player" and "sig-monitor" for installation instructions.

## `sig-monitor`

To run the sig-monitor, navigate to the cmd/monitor directory and execute the following command:

```bash
go run main.go
```

This will start a web server on port 58501.

# Usage
Once successfully installed, the daemons can be started with the following commands:

# Contributing
We welcome any kind of contributions to this project. Please review our contribution guidelines before creating a pull request.

# License
This project is released under the NOLICENSE license.