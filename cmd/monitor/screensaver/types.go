package screensaver

type ScreensaverOptions struct {
	// threshold in milliseconds
	Threshold int `json:"threshold"`
	// Source
	Source string `json:"source"`
}

func (s *ScreensaverOptions) IsValid() bool {
	return s.Threshold > 0 && s.Source != ""
}
