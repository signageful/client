package config

import (
	"os"
	"strings"

	"github.com/coreos/pkg/capnslog"
	"github.com/spf13/viper"
)

var log = capnslog.NewPackageLogger("github.com/signageful/client", "config")

func Init(cfgFile string, logLevel string) {
	lvl := capnslog.WARNING

	if logLevel != "" {
		// Initialize logging system
		var err error
		lvl, err = capnslog.ParseLevel(strings.ToUpper(logLevel))
		if err != nil {
			log.Warningf("Wrong Log level %v, defaults to [Warning]", logLevel)
			lvl = capnslog.WARNING
		}
	}

	capnslog.SetGlobalLogLevel(lvl)
	capnslog.SetFormatter(capnslog.NewPrettyFormatter(os.Stdout, false))

	viper.SetEnvPrefix("signageful")
	viper.SetConfigName("signageful")        // name of config file (without extension)
	viper.AddConfigPath("$HOME/.signageful") // adding home directory as first search path
	viper.AddConfigPath(".")                 // adding home directory as first search path
	viper.AutomaticEnv()                     // read in environment variables that match
	if cfgFile != "" {
		viper.SetConfigFile(cfgFile)
	}
	err := viper.ReadInConfig()

	if err != nil {
		e, ok := err.(viper.ConfigParseError)
		if ok {
			log.Fatalf("error parsing config file: %v", e)
		}
		log.Debugf("No config file used")
	} else {
		log.Debugf("Using config file: %v", viper.ConfigFileUsed())
	}
}
