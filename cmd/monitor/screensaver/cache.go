package screensaver

// import (
// 	"crypto/md5"
// 	"fmt"
// 	"io/ioutil"
// 	"log"
// 	"net/http"
// 	"time"
// )

// const cacheExpiration = 72 * time.Hour

// type cacheData struct {
// 	data       []byte
// 	timestamp  time.Time
// 	expiration time.Time
// }

// var cache = make(map[string]cacheData)

// func cacheKey(url string) string {
// 	return fmt.Sprintf("%x", md5.Sum([]byte(url)))
// }

// func cacheScreensaver(url string) ([]byte, error) {
// 	key := cacheKey(url)
// 	cachedData, ok := cache[key]
// 	if ok {
// 		cachedData.expiration = time.Now().Add(cacheExpiration)
// 		cache[key] = cachedData
// 		return cachedData.data, nil
// 	}

// 	resp, err := http.Get(url)
// 	if err != nil {
// 		return nil, err
// 	}
// 	defer resp.Body.Close()

// 	data, err := ioutil.ReadAll(resp.Body)
// 	if err != nil {
// 		return nil, err
// 	}

// 	cache[key] = cacheData{
// 		data:       data,
// 		timestamp:  time.Now(),
// 		expiration: time.Now().Add(cacheExpiration),
// 	}
// 	return data, nil
// }

// func invalidateCache(url string) {
// 	key := cacheKey(url)
// 	delete(cache, key)
// }

// func runCacheGC() {
// 	defer func() {
// 		if r := recover(); r != nil {
// 			log.Printf("Screensaver cache GC panic: %v", r)
// 		}
// 	}()

// 	for {
// 		time.Sleep(time.Hour)
// 		now := time.Now()
// 		for key, data := range cache {
// 			if now.After(data.expiration) {
// 				delete(cache, key)
// 			}
// 		}
// 	}
// }

// func init() {
// 	go runCacheGC()
// }
