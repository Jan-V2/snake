let canvas = document.getElementById("mycanvas");
let drawing = canvas.getContext("2d");

let square_size = 20;
let squares_x = (canvas.width / square_size) -2;
let squares_y = (canvas.height / square_size) -2;
let game_ended = false;
let m = Math;


let square_states = {
    empty: 0,
    snake: 1,
    apple: 2
};

let directs = {
    up: 0,
    down: 1,
    left: 2,
    right: 3
};

function get_board_state_array() {
    // .fill has a bug if you do a .fill inside a .fill
    let ret = Array();
    for(let i in _.range(squares_x)){
        ret.push(Array(squares_y).fill(square_states.empty))
    }
    return ret
}

let get_coord = (x, y) => {return {x:x, y:y}};
let game_board = get_board_state_array();
let current_direction = directs.left;
let last_tick_direction = directs.left;
let snake = Array();

function iterate(func) {
    for (let i in _.range(game_board.length)){
        for (let j in _.range(game_board[i].length) ) {
            func(i, j)
        }
    }
}

function add_snake() {
    let snakelength = 4;
    let snake_x = m.floor(game_board.length / 2) - m.floor(snakelength /2);
    let snake_y = m.floor(game_board[0].length / 2);
    for (let i in _.range(snakelength)){
        let x = snake_x + +i;
        snake.push(get_coord(x, snake_y))
    }
}

let add_apple = () => {
    let coord = get_random_coord(squares_x, squares_y);
    let is_in_snake = (coord) => {
        snake.forEach((e) => {
            if (coords_are_the_same(e, coord)){
                return true
            }
        });
        return false
    };
    while(is_in_snake(coord)){
        coord = get_random_coord(squares_x, squares_y)
    }
    game_board[coord.x][coord.y] = square_states.apple
};

add_snake();
add_apple();

function Draw() {
    function get_color(key) {
        if(key === square_states.snake){
            return "#00FF00"
        }
        if(key === square_states.apple){
            return "#FF0000"
        }
    }

    function fill_square(x, y, key) {
        if (key !== square_states.empty){
            drawing.fillStyle = get_color(key);
            let x_coord = x * square_size + square_size;
            let y_coord = y * square_size + square_size;
            drawing.fillRect(x_coord, y_coord, square_size, square_size)
        }

    }

    this.draw_background = () =>{
        drawing.fillStyle = "#000000";
        drawing.fillRect(0, 0, canvas.width, canvas.height);
    };

    this.draw_border = () => {
        drawing.fillStyle = "#DFDFDF";
        drawing.fillRect(0, 0, canvas.width, square_size);
        drawing.fillRect(0, 0, square_size, canvas.height);
        drawing.fillRect(0, canvas.height - square_size, canvas.width, square_size);
        drawing.fillRect(canvas.width - square_size, 0, square_size, canvas.height);
    };

    this.draw_board = () =>{
        iterate((x, y) => {
            let square_key = game_board[x][y];
            if (square_key !== square_states.empty){
                fill_square(x, y, square_key);
            }
        })
    };
    this.draw_snake = () => {
      snake.forEach((e) => {
          fill_square(e.x, e.y, square_states.snake);
      })
    };

    this.draw_game_lost = () => {
        let text ="You lost";
        let fontsize = 125;
        drawing.font= fontsize + "px Arial";
        drawing.fillStyle = "#FFFFFF";
        drawing.textAlign = "center";
        drawing.fillText(text , canvas.width / 2, canvas.height / 2 + (fontsize /4)  );
        drawing.fill()
    };
}
let draw = new Draw();

function draw_frame() {
    draw.draw_background();
    draw.draw_border();
    draw.draw_board();
    draw.draw_snake()
}

function check_collision_and_update_snake() {
    let coord = snake[0];
    let new_coord;
    if (current_direction === directs.up){
        new_coord = get_coord(coord.x, coord.y-1);
        //console.log("up");
    }
    if (current_direction === directs.down){
        new_coord = get_coord(coord.x, coord.y+1);
        //console.log("down");
    }
    if (current_direction === directs.left){
        new_coord = get_coord(coord.x -1, coord.y);
        //console.log("left");
    }
    if (current_direction === directs.right){
        new_coord = get_coord(coord.x +1, coord.y);
        //console.log("right");
    }

    //console.log(snake[0]);
    //console.log(new_coord);
    //console.log(snake);

    if(!(new_coord.x> -1 && new_coord.x < squares_x && new_coord.y> -1 && new_coord.y < squares_y)){
        console.log("edge");
        game_end();
    }

    snake.forEach((e) => {
        if (coords_are_the_same(e, new_coord)){
            console.log("snake");
            game_end()
        }
    });
    if(!game_ended){
        snake.unshift(new_coord);
        last_tick_direction = current_direction;
        if (game_board[new_coord.x][new_coord.y] === square_states.apple){
            game_board[new_coord.x][new_coord.y] = square_states.empty;
            add_apple();
            ticks_between_frames = m.floor(ticks_between_frames * 0.90)
        }else{
            snake.splice(snake.length-1, 1);
        }

    }
}

function game_end() {
    game_ended = true;
    draw.draw_game_lost();
}

draw_frame();

function keyboard_input(event) {

    let key_code = event.charCode;
    //console.log(key_code);
    let reverse_direction = (direction) => {
        if (direction === directs.up){
            return directs.down
        }
        if (direction === directs.down){
            return directs.up
        }
        if (direction === directs.left){
            return directs.right
        }
        if (direction === directs.right){
            return directs.left
        }
    };

    if (key_code === 119){
        if(reverse_direction(last_tick_direction) !== directs.up){
            current_direction = directs.up
        }
    }
    if (key_code === 115){
        if(reverse_direction(last_tick_direction) !== directs.down){
            current_direction = directs.down
        }
    }
    if (key_code === 97){
        if(reverse_direction(last_tick_direction) !== directs.left){
            current_direction = directs.left
        }
    }
    if (key_code === 100){
        if(reverse_direction(last_tick_direction) !== directs.right){
            current_direction = directs.right
        }
    }
}

window.onkeypress = keyboard_input;

let frames = 0;
let ticks_between_frames = 70;

window.setInterval(function () {
    if(!game_ended){
        frames++;
        if(frames % ticks_between_frames === 0){
            check_collision_and_update_snake();
            if(!game_ended){
                draw_frame()
            }
        }
    }
}, 5);