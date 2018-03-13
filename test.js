let startingArray = [2, 4, 6, 8, 9, 15]

startingArray = startingArray.filter(ele => ele%3)
														 .map(e => `${e*e}`)

console.log(startingArray)
