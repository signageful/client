package cmd

import (
	"fmt"
	"os"

	"github.com/coreos/pkg/capnslog"
	"github.com/signageful/client/cmd/monitor/config"
	"github.com/signageful/client/cmd/monitor/container"
	"github.com/signageful/client/cmd/monitor/middleware"
	"github.com/signageful/client/cmd/monitor/server"
	"github.com/spf13/cobra"
)

var log = capnslog.NewPackageLogger("github.com/signageful/client", "cmd")

var (
	cfgFile  string
	logLevel string
	version  string
	banner   = `
Signageful Monitoring Agent
version: %s
____________________________________O/_______
                                    O\
`
)

// RootCmd represents the base command when called without any subcommands
var RootCmd = &cobra.Command{
	Use:   "sig-monitor",
	Short: "The Monitoring Agent for Signageful",
	Long:  ``,
	Run:   runRootCmd,
}

func Execute(v string) {
	version = v

	if err := RootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(-1)
	}
}

func init() {
	cobra.OnInitialize(initConfig)
	RootCmd.PersistentFlags().StringVar(&cfgFile, "config", "", "config file (default is $HOME/signageful.yml)")
	RootCmd.PersistentFlags().StringVar(&logLevel, "log-level", "", "log level [Panic,Fatal,Error,Warn,Info,Debug]")
}

func initConfig() {
	config.Init(cfgFile, logLevel)
}

func runRootCmd(cmd *cobra.Command, args []string) {
	fmt.Println("Starting Signageful Monitoring Agent")
	fmt.Printf(banner, version)

	providers := getProviders()
	mainServer := server.CreateDefaultServer(providers)

	if err := mainServer.Start(":58501"); err != nil {
		fmt.Printf("Error starting server: %v", err)
	}
}

func getProviders() middleware.Providers {
	return middleware.Providers{
		Container: container.NewContainerProvider(),
	}
}
