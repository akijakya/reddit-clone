package main

func split(sum int) (x, y int) {
	x = sum * 4 / 9
	y = sum - x
	return
}

// func main() {
// 	log.Println(split(5))
// }
