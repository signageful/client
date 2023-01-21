package main

import (
	"github.com/signageful/client/cmd/monitor/cmd"
)

var Version = "development"

func main() {

	cmd.Execute(Version)

}
