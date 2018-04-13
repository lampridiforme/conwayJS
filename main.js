// this file contains the main logic for Conway's Game (no UI specific stuff should go here)
// Methods:
// init(int, bool, bool): initialize a game with options
// next(): move to next iteration of the game
// reset(): resets the game with new random cell placement

ConwayLogic = function() {
	let arena = [];
	let prev = [];
	// option to have a closed box or wrap to other side
	let wraparound = false;
	let donePreempt = false;

	// initGame(size: int, wrap: bool, done:bool): set up the game by specifying arena size, if wrapping should be turned on, and if the game should terminate if new patterns are not being generated
	function initGame(size, wrap, done) {
		console.log("Game is initialized");
		initArena(size);
		wraparound = wrap;
		donePreempt = done;
	}

	// next(): advance to next iteration
	function next() {
		// TODO
	}

	// reset(): resets the game
	// currently does not support specific cell placements or other probabilities for cell generation
	function reset() {
		// TODO
	}

	// foreach2d(arr, fun): perform the function for each section of a 2d array
	// honestly not as useful as it would seem
	function foreach2d(arr, fun) {
		for(let i = 0; i < arr.length; i++) {
			for(let j = 0; j < arr[i].length; j++) {
				let retval = fun(arr[i][j]);
				// set the array to the new value if function actually returns something
				if(typeof(retval) !== "undefined") {
					arr[i][j] = fun(arr[i][j]);
				}			
			}
		}
	}

	// initArena(size): initializes the arena 
	function initArena(size) {
		for(let i = 0; i < size; i++) {
			let subarray = [];
			for(let j = 0; j < size; j++) {
				subarray.push(0);
			}
			arena.push(subarray);
		}
	}

	// initRandom(): populate the arena with the living or dead cells
	function initRandom(arr) {
		for(let i = 0; i < arr.length; i++) {
			for(let j = 0; j < arr[i].length; j++) {
				// generate 1 or 0
				arr[i][j] = Math.floor((Math.random()*2));
			}
		}
	}

	// copyArena(oldArr): copy the old arena data and return it
	function copyArena(oldArr) {
		console.log(oldArr);
		newArr = [];
		for(let i = 0; i < oldArr.length; i++) {
			let subarray = [];
			for(let j = 0; j < oldArr[i].length; j++) {
				if(getBlock(oldArr, i, j) === 1) {
					subarray.push(1);
				}
				else {
					subarray.push(0);
				}
			}
			newArr.push(subarray);
		}
		console.log(newArr);
		return newArr;
	}

	// update(arr): update the arena by killing or birthing cells
	function update(arr) {
		// need to create a deep copy since the prev and arena point to the same list
		prev = (JSON.parse(JSON.stringify(arr)));

		for(let i = 0; i < arr.length; i++) {
			for(let j = 0; j < arr[i].length; j++) {
				let livingNeighbors = 0;
				let currBlock = arr[i][j];
				// cases
				let nw = 0;
				let n = 0;
				let ne = 0;
				let e = 0;
				let se = 0;
				let s = 0;
				let sw = 0;
				let w = 0;

	            // NW
	            nw = getBlock(arr, (i-1), (j-1));
	            livingNeighbors += nw;

	            // N
	            n = getBlock(arr, i, (j-1));
	            livingNeighbors += n;

	            // NE
	            ne = getBlock(arr, (i+1), (j-1));
	            livingNeighbors += ne;

	            // E
	            e = getBlock(arr, (i+1), j);
	            livingNeighbors += e;

	            // SE
	            se = getBlock(arr, (i+1), (j+1));
	            livingNeighbors += se;

	            // S
	            s = getBlock(arr, i, (j+1));
	            livingNeighbors += s;

	            // SW
	            sw = getBlock(arr, (i-1), (j+1));
	            livingNeighbors += sw;

	            // W
	            w = getBlock(arr, (i-1), j);
	            livingNeighbors += w;

	            // if alive
	            if(currBlock === 1) {
	            	// kill
	            	if(livingNeighbors < 2 || livingNeighbors > 3) {
	            		unsetBlock(arr, i, j);
	            	}
	            }

	            // if empty
	            if(currBlock === 0) {
	            	if(livingNeighbors === 3) {
	            		setBlock(arr, i, j);
	            	}
	            }
			}
		}
	} 

	// isSame(curr, prev): check if two arenas are the same
	function isSame(curr, prev) {
		// height check
		if(curr.length !== prev.length) {
			return false;
		}
		for(let i = 0; i < curr.length; i++) {
			// width check
			if(curr[i].length !== prev[i].length) {
				return false;
			}
			for(let j = 0; j < curr[i].length; j++) {
				if(getBlock(curr, i, j) !== getBlock(prev, i, j)) {
					return false;
				}
			}
		}
		return true;
	}

	// printArena(): prints the arena to console
	function printArena(arr) {
		for(let i = 0; i < arr.length; i++) {
			let curLine = "";
		    for(let j = 0; j < arr[i].length; j++) {
		        if(arr[i][j] == 1) {
		            curLine += "█";
		        }
		        else {
		            curLine += "░";
		        }
		    }
		    console.log(curLine);
		}
	}

	// setBlock(arr, x, y): set block to 1 (with style!)
	function setBlock(arr, x, y) {
		arr[x][y] = 1;
	}

	// unsetBlock(arr, x, y): set block to 0 (with style!)
	function unsetBlock(arr, x, y) {
		arr[x][y] = 0;
	}

	// getBlock(arr, x, y): get the position's cell status or give 0 if invalid
	function getBlock(arr, x, y) {
		// invalid positions return 0 (dead)
		// TODO: implement wraparound, should be simple enough
		if(x < 0 || y < 0 || x >= arr.length || y >= arr[0].length) {
			return 0;
		}
		return arr[x][y];
	}

	// debug stuff ¯\_(ツ)_/¯
	initArena(10);
	initRandom(arena);

	let i = 0;
	while(!isSame(arena, prev)) {
		console.log("Iteration " + i);
		update(arena);
		printArena(arena);
		console.log();
		i++;
	}
	console.log("Done.");

	return {
		// TODO: figure out what things I want to expose to the outside world
		init:initGame,
		next:next
	}
}();

// debugging on the module level
let m = ConwayLogic;
ConwayLogic.init();