{
	const hSize = 10, wSize = 9;
	class Piece {
		static role = {
			empty: 0,
			captain: 1,
			guard: 2,
			elephant: 3,
			horse: 4,
			car: 5,
			duck: 6,
			soldier: 7
		};
		static str = {
			[Piece.role.empty]: 'empty',
			[Piece.role.captain]: 'captain',
			[Piece.role.guard]: 'guard',
			[Piece.role.elephant]: 'elephant',
			[Piece.role.horse]: 'horse',
			[Piece.role.car]: 'car',
			[Piece.role.duck]: 'duck',
			[Piece.role.soldier]: 'soldier'
		};
		static cName = {
			[Piece.role.empty]: '',
			[Piece.role.captain]: '王',
			[Piece.role.guard]: '士',
			[Piece.role.elephant]: '象',
			[Piece.role.horse]: '马',
			[Piece.role.car]: '车',
			[Piece.role.duck]: '鸭',
			[Piece.role.soldier]: '兵'
		};
		static moveChk = {
			[Piece.role.empty]: () => false,
			[Piece.role.captain]: (x1, y1, x2, y2) => {
				const canMove = [
					{x: 1, y: 0},
					{x: -1, y: 0},
					{x: 0, y: 1},
					{x: 0, y: -1}
				];
				return canMove.some((move) => {
					return x1 + move.x === x2 && y1 + move.y === y2;
				});
			},
			[Piece.role.guard]: (x1, y1, x2, y2) => {
				const canMove = [
					{x: 1, y: 1},
					{x: 1, y: -1},
					{x: -1, y: 1},
					{x: -1, y: -1}
				];
				return canMove.some((move) => {
					return x1 + move.x === x2 && y1 + move.y === y2;
				});
			},
			[Piece.role.elephant]: (x1, y1, x2, y2) => {
				const canMove = [
					{x: 2, y: 2, xLim: 1, yLim: 1},
					{x: 2, y: -2, xLim: 1, yLim: -1},
					{x: -2, y: 2, xLim: -1, yLim: 1},
					{x: -2, y: -2, xLim: -1, yLim: -1}
				];
				return canMove.some((move) => {
					return x1 + move.x === x2 && y1 + move.y === y2 && map[x1 + move.xLim][y1 + move.yLim].isEmpty();
				});
			},
			[Piece.role.horse]: (x1, y1, x2, y2) => {
				const canMove = [
					{x: -1, y: 2, xLim: 0, yLim: 1},
					{x: 1, y: 2, xLim: 0, yLim: 1},
					{x: 2, y: 1, xLim: 1, yLim: 0},
					{x: 2, y: -1, xLim: 1, yLim: 0},
					{x: 1, y: -2, xLim: 0, yLim: -1},
					{x: -1, y: -2, xLim: 0, yLim: -1},
					{x: -2, y: -1, xLim: -1, yLim: 0},
					{x: -2, y: 1, xLim: -1, yLim: 0},
				];
				return canMove.some((move) => {
					return x1 + move.x === x2 && y1 + move.y === y2 && map[x1 + move.xLim][y1 + move.yLim].isEmpty();
				});
			},
			[Piece.role.car]: (x1, y1, x2, y2) => {
				if (x1 === x2 && y1 !== y2) {
					// Horizontally, check if there are non-empty elements between the 2 positions
					const [left, right] = y1 < y2 ? [y1, y2] : [y2, y1];
					return map[x1].slice(left+1, right).every((element) => element.isEmpty());
				} else if (y1 === y2 && x1 !== x2) {
					// Vertically, check if there are non-empty elements between the 2 positions
					const [top, bottom] = x1 < x2 ? [x1, x2] : [x2, x1];
					return map.slice(top+1, bottom).every((subArr) => subArr[y1].isEmpty());
				}
				return false;
			},
			[Piece.role.duck]: (x1, y1, x2, y2) => {
				const canDis = [
					{dx: 1, dy: 1},
					{dx: 1, dy: -1},
					{dx: -1, dy: 1},
					{dx: -1, dy: -1},
				]
				return canDis.some((dis) => {
					return (x1 + dis.dx * 3 === x2 && y1 + dis.dy * 2 === y2 && map[x1 + dis.dx * 2][y1 + dis.dy].isEmpty() && map[x1 + dis.dx][y1].isEmpty()) ||
					(x1 + dis.dx * 2 === x2 && y1 + dis.dy * 3 === y2 && map[x1 + dis.dx][y1 + dis.dy * 2].isEmpty() && map[x1][y1 + dis.dy].isEmpty());
				});
			},
			[Piece.role.soldier]: (x1, y1, x2, y2) => {
				const canMove = [
					{x: 1, y: 1},
					{x: 1, y: 0},
					{x: 1, y: -1},
					{x: 0, y: 1},
					{x: 0, y: -1},
					{x: -1, y: 1},
					{x: -1, y: 0},
					{x: -1, y: -1}
				];
				return canMove.some((move) => {
					return x1 + move.x === x2 && y1 + move.y === y2;
				});
			}
		};
		constructor(type, team = 0){
			this.type = type;
			this.team = team;
			this.name = Piece.str[type];
			this.cName = Piece.cName[type];
		}
		setPosition(x, y) {
			this.x = x;
			this.y = y;
		}
		canMoveTo(x, y) {
			if (x < 0 || y < 0 || x >= hSize || y >= wSize || this.team !== curTeam || map[x][y].team === curTeam) return false;
			return Piece.moveChk[this.type](this.x, this.y, x, y);
		}
		isEmpty() {
			return this.type === 0;
		}
		onDeath() {
			if(this.type === 1){
				curTeam = 3;
				text = `${this.team === 1 ? "蓝" : "红"}方胜利`;
				curtain = curtainTime;
				textColor = curtainColor = this.team === 1 ? "#00f" : "#f00";
			}
		}
	}
	class Rect {
		constructor (left, top, right, bottom){
			this.left = left;
			this.top = top;
			this.right = right;
			this.bottom = bottom;
		}
		get width() {
			return this.right - this.left;
		}
		get height() {
			return this.bottom - this.top;
		}
		get midx() {
			return (this.left + this.right) / 2;
		}
		get midy() {
			return (this.top + this.bottom) / 2;
		}
	}
	const initMap = [
		[
			new Piece(Piece.role.car,1), new Piece(Piece.role.horse,1), new Piece(Piece.role.elephant,1),
			new Piece(Piece.role.guard,1), new Piece(Piece.role.captain,1), new Piece(Piece.role.guard,1),
			new Piece(Piece.role.elephant,1), new Piece(Piece.role.horse,1), new Piece(Piece.role.car,1)
		],
		[
			new Piece(0), new Piece(0), new Piece(0), new Piece(0), new Piece(0),
			new Piece(0), new Piece(0), new Piece(0), new Piece(0)
		],
		[
			new Piece(Piece.role.duck,1), new Piece(0), new Piece(0), new Piece(0), new Piece(0),
			new Piece(0), new Piece(0), new Piece(0), new Piece(Piece.role.duck,1)
		],
		[
			new Piece(Piece.role.soldier,1), new Piece(0), new Piece(Piece.role.soldier,1),
			new Piece(0), new Piece(Piece.role.soldier,1), new Piece(0),
			new Piece(Piece.role.soldier,1), new Piece(0), new Piece(Piece.role.soldier,1)
		],
		[
			new Piece(0), new Piece(0), new Piece(0), new Piece(0), new Piece(0),
			new Piece(0), new Piece(0), new Piece(0), new Piece(0)
		],
		[
			new Piece(0), new Piece(0), new Piece(0), new Piece(0), new Piece(0),
			new Piece(0), new Piece(0), new Piece(0), new Piece(0)
		],
		[
			new Piece(Piece.role.soldier,2), new Piece(0), new Piece(Piece.role.soldier,2),
			new Piece(0), new Piece(Piece.role.soldier,2), new Piece(0),
			new Piece(Piece.role.soldier,2), new Piece(0), new Piece(Piece.role.soldier,2)
		],
		[
			new Piece(Piece.role.duck,2), new Piece(0), new Piece(0), new Piece(0), new Piece(0),
			new Piece(0), new Piece(0), new Piece(0), new Piece(Piece.role.duck,2)
		],
		[
			new Piece(0), new Piece(0), new Piece(0), new Piece(0), new Piece(0),
			new Piece(0), new Piece(0), new Piece(0), new Piece(0)
		],
		[
			new Piece(Piece.role.car,2), new Piece(Piece.role.horse,2), new Piece(Piece.role.elephant,2),
			new Piece(Piece.role.guard,2), new Piece(Piece.role.captain,2), new Piece(Piece.role.guard,2),
			new Piece(Piece.role.elephant,2), new Piece(Piece.role.horse,2), new Piece(Piece.role.car,2)
		],
	];
	const blockSize = 80;
	const boardRect = new Rect(40, 40, 40 + wSize * blockSize, 40 + hSize * blockSize);
	const textRect = new Rect(boardRect.left + 10, boardRect.bottom + 40, boardRect.right - 10, boardRect.bottom + 80);
	const stageRect = new Rect(0, 0, boardRect.right + 40, textRect.bottom + 40);
	const errShowTime = 40, shineTime = 40, shakeTime = 10, curtainTime = 60;
	const shakeDis = [0, 1, 1, 2, 2, 3, 4, 6, 9, 13, 20];
	let map = [], badClick = [], shine = [], canChoose = [], move = 0;
	let stage, ctx;
	let text = "红方下棋", textColor = "#f00";
	let curtain = 0, curtainColor;
	let windowWidth, windowHeight;
	function resize() {
		windowWidth = document.documentElement.clientWidth;
		windowHeight = document.documentElement.clientHeight;
		if (stage) {
			stage.style.width = `${Math.min(windowWidth, windowHeight / stageRect.height * stageRect.width)}px`;
			stage.style.height = `${Math.min(windowHeight, windowWidth / stageRect.width * stageRect.height)}px`;
		}
	}
	window.addEventListener('resize', resize);
	async function init(callback) {
		//initalize game arrays
		initMap.forEach((subArr, i) => {
			map[i] = [...subArr];
			subArr.forEach((element, j) => {
				element.setPosition(i, j);
			});
		});
		badClick = Array(hSize).fill().map(() => Array(wSize).fill(0));
		shine = Array(hSize).fill().map(() => Array(wSize).fill(0));
		canChoose = Array(hSize).fill().map(() => Array(wSize).fill(false));
		//create stage canvas
		stage = document.createElement("canvas");
		stage.width = stageRect.width;
		stage.height = stageRect.height;
		ctx = stage.getContext("2d");
		resize();
		document.getElementById("main").append(stage);
		stage.addEventListener("click", (e) => {
			click.push({x: e.offsetX / stage.clientWidth * stageRect.width, y: e.offsetY / stage.clientHeight * stageRect.height});
		});
		stage.addEventListener("mousemove", (e) => {
			const cx = (boardRect.bottom - e.offsetY / stage.clientHeight * stageRect.height) / blockSize | 0;
			const cy = (e.offsetX / stage.clientWidth * stageRect.width - boardRect.left) / blockSize | 0;
			if (cx < 0 || cx >= hSize || cy < 0 || cy >= wSize) hovering = null;
			else hovering = {x: cx, y: cy};
		});
		//hide loading
		document.getElementById("loading").style.display = "none";
		//callback
		callback();
	}
	let curTeam = 1; // current team to move
	let hovering = null, selecting = null; // current chess piece selected
	let click = [];
	function update() {
		const updateClick = (pos) => {
			let cx = (boardRect.bottom - pos.y) / blockSize | 0, cy = (pos.x - boardRect.left) / blockSize | 0;
			if (cx < 0 || cx >= hSize || cy < 0 || cy >= wSize) return;
			if (selecting === null) {
				if (map[cx][cy].team === curTeam) {
					selecting = {x: cx, y: cy};
					for (let i = 0; i < hSize; ++i) {
						for (let j = 0; j < wSize; ++j) {
							canChoose[i][j] = map[cx][cy].canMoveTo(i, j);
						}
					}
				} else {
					canChoose = Array(hSize).fill().map(() => Array(wSize).fill(false));
					badClick[cx][cy] = errShowTime;//for moving an enemy chess or space
				}
			} else {
				if (map[selecting.x][selecting.y].canMoveTo(cx, cy)) {
					curTeam = 3 - curTeam;
					text = `${curTeam === 1 ? "红" : "蓝"}方下棋`;
					textColor = curTeam === 1 ? "#f00" : "#00f";
					shine[selecting.x][selecting.y] = 0;
					shine[cx][cy] = shineTime;
					move = shakeTime;
					canChoose = Array(hSize).fill().map(() => Array(wSize).fill(false));
					map[cx][cy].onDeath();
					map[selecting.x][selecting.y].setPosition(cx,cy);
					map[cx][cy] = map[selecting.x][selecting.y];
					map[selecting.x][selecting.y] = new Piece(0);
					selecting = null;
				} else if (map[cx][cy].team === curTeam) {
					selecting = {x: cx, y: cy};
					for (let i = 0; i < hSize; ++i) {
						for (let j = 0; j < wSize; ++j) {
							canChoose[i][j] = map[cx][cy].canMoveTo(i, j);
						}
					}
				} else {
					selecting = null;
					canChoose = Array(hSize).fill().map(() => Array(wSize).fill(false));
					badClick[cx][cy] = errShowTime;//for bad movement
				}
			}
		}
		const updateAnimation = () => {
			if(curtain) --curtain;
			if(move) --move;
			for (let i = 0; i < hSize; ++i) {
				for (let j = 0; j < wSize; ++j) {
					if(badClick[i][j]) --badClick[i][j];
					if(shine[i][j]) --shine[i][j];
				}
			}
		}
		click.forEach(pos => {
			updateClick(pos);
		});
		click = [];
		updateAnimation();
	}
	CanvasRenderingContext2D.prototype.box = function (x, y, l, r, w, c) {
		ctx.strokeStyle = c;
		ctx.lineWidth = w;
		this.beginPath();
		this.moveTo(x - r, y - r - w / 2);
		this.lineTo(x - r, y - l);
		this.stroke();
		this.closePath();
		this.beginPath();
		this.moveTo(x - r + w / 2, y - r);
		this.lineTo(x - l, y - r);
		this.stroke();
		this.closePath();
		this.beginPath();
		this.moveTo(x + r, y - r - w / 2);
		this.lineTo(x + r, y - l);
		this.stroke();
		this.closePath();
		this.beginPath();
		this.moveTo(x + r - w / 2, y - r);
		this.lineTo(x + l, y - r);
		this.stroke();
		this.closePath();
		this.beginPath();
		this.moveTo(x - r, y + r + w / 2);
		this.lineTo(x - r, y + l);
		this.stroke();
		this.closePath();
		this.beginPath();
		this.moveTo(x - r + w / 2, y + r);
		this.lineTo(x - l, y + r);
		this.stroke();
		this.closePath();
		this.beginPath();
		this.moveTo(x + r, y + r + w / 2);
		this.lineTo(x + r, y + l);
		this.stroke();
		this.closePath();
		this.beginPath();
		this.moveTo(x + r - w / 2, y + r);
		this.lineTo(x + l, y + r);
		this.stroke();
		this.closePath();
	}
	function render() {
		ctx.clearRect(stageRect.left, stageRect.top, stageRect.width, stageRect.height);
		ctx.save();
		ctx.translate(0, shakeDis[move]);//shake SFX
		const renderBoard = () => {
			ctx.fillStyle = "#fd4";
			ctx.fillRect(boardRect.left, boardRect.top, boardRect.width, boardRect.height);
			ctx.strokeStyle = "#640";
			ctx.lineWidth = 3;
			for (let i = 0; i < wSize; ++i) {
				ctx.beginPath();
				ctx.moveTo(boardRect.left + blockSize / 2 + i * blockSize, boardRect.top + blockSize / 2);
				ctx.lineTo(boardRect.left + blockSize / 2 + i * blockSize, boardRect.bottom - blockSize / 2);
				ctx.stroke();
				ctx.closePath();
				ctx.fillStyle = "#666";
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";
				ctx.font="30px sans-serif";
				ctx.fillText(i, boardRect.left + blockSize / 2 + i * blockSize, boardRect.bottom + 15);
			}
			for (let i = 0; i < hSize; ++i) {
				ctx.beginPath();
				ctx.moveTo(boardRect.left + blockSize / 2, boardRect.top + blockSize / 2 + i * blockSize);
				ctx.lineTo(boardRect.right - blockSize / 2, boardRect.top + blockSize / 2 + i * blockSize);
				ctx.stroke();
				ctx.closePath();
				ctx.fillStyle = "#666";
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";
				ctx.font="30px sans-serif";
				ctx.fillText(hSize - i - 1, boardRect.left - 15, boardRect.top + blockSize / 2 + i * blockSize);
			}
		}
		const renderChess = () => {
			//render hovering sign
			if (hovering && (map[hovering.x][hovering.y].team === curTeam || canChoose[hovering.x][hovering.y])) {
				const x = boardRect.left + blockSize / 2 + hovering.y * blockSize, y = boardRect.bottom - blockSize / 2 - hovering.x * blockSize;
				ctx.box(x, y, 20, 35, 4, "#fff");
			}
			//render selecting sign
			if (selecting) {
				const x = boardRect.left + blockSize / 2 + selecting.y * blockSize, y = boardRect.bottom - blockSize / 2 - selecting.x * blockSize;
				ctx.box(x, y, 20, 35, 4, "#7f8");
			}
			//render chess
			for (let i = 0; i < hSize; ++i) {
				for (let j = 0; j < wSize; ++j) {
					//render error sign
					const x = boardRect.left + blockSize / 2 + j * blockSize, y = boardRect.bottom - blockSize / 2 - i * blockSize;
					ctx.box(x, y, 20, 35, 4, `#f44${(badClick[i][j] / errShowTime * 15 | 0).toString(16)}`);
					//render choosable sign
					if(!map[i][j].isEmpty()){
						//shade
						ctx.beginPath();
						ctx.arc(x, y + 6, 30, 0, 2 * Math.PI);
						ctx.fillStyle = "#0007";
						ctx.fill();
						ctx.closePath();
						//shape
						ctx.beginPath();
						ctx.arc(x, y, 30, 0, 2 * Math.PI);
						ctx.fillStyle = "#eee";
						ctx.fill();
						ctx.closePath();
						ctx.beginPath();
						ctx.arc(x, y + 3, 30, 0, 2 * Math.PI);
						ctx.fillStyle = "#eee";
						ctx.fill();
						ctx.closePath();
						ctx.beginPath();
						ctx.arc(x, y, 26, 0, 2 * Math.PI);
						ctx.strokeStyle = map[i][j].team === 1 ? "#f00" : "#00f";
						ctx.lineWidth = 2;
						ctx.stroke();
						ctx.closePath();
						//text
						ctx.fillStyle = map[i][j].team === 1 ? "#f00" : "#00f";
						ctx.textAlign = "center";
						ctx.textBaseline = "middle";
						ctx.font="25px sans-serif";
						ctx.fillText(map[i][j].cName, x, y);
						//render shiny sign
						ctx.beginPath();
						ctx.arc(x, y, 30, 0, 2 * Math.PI);
						ctx.fillStyle = `#fff${(shine[i][j] / shineTime * 13 | 0).toString(16)}`;
						ctx.fill();
						ctx.closePath();
					}
					if (canChoose[i][j]){
						ctx.beginPath();
						ctx.arc(x, y, 10, 0, 2 * Math.PI);
						ctx.fillStyle = "#3f4d";
						ctx.fill();
						ctx.closePath();
					}
				}
			}
		}
		const renderText = () => {
			ctx.fillStyle = "#ccc";
			ctx.fillRect(textRect.left, textRect.top, textRect.width, textRect.height);
			ctx.fillStyle = textColor;
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.font="30px sans-serif";
			ctx.fillText(text, textRect.midx, textRect.midy);
		}
		const renderCurtain = () => {
			if(curtain){
				ctx.fillStyle = curtainColor + (curtain / curtainTime * 10 | 0).toString(16);
				ctx.fillRect(stageRect.left, stageRect.top, stageRect.width, stageRect.height);
			}
		}
		renderBoard();
		renderChess();
		renderText();
		renderCurtain();
		ctx.restore();
	}
	function main() {
		update();
		render();
		requestAnimationFrame(main);
	}
	window.addEventListener("load", () => {
		init(main);
	});
}
