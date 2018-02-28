

function get_random_int(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function get_random_coord(x_max, y_max) {
    return {
        x: get_random_int(x_max),
        y: get_random_int(y_max)
    }
}

function coords_are_the_same(coord1, coord2) {
    return coord1.x === coord2.x && coord1.y === coord2.y;
}

function iterate_through_2d_array(func) {
    for (let i in _.range(game_board.length)){
        for (let j in _.range(game_board[i].length) ) {
            func(i, j)
        }
    }
}