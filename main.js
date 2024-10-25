/*
ToDo
*/

const fps = 60

window.onload = () =>
{
	let inputs = {"KeyW": 0, "KeyS": 0, "KeyA": 0, "KeyD": 0}
	let listen = Object.keys(inputs)

	addEventListener("keydown", keydown)
	addEventListener("keyup", keyup)

	document.addEventListener('mousedown', function(event)
	{
		let mouse_pos = new vec2(event.clientX, event.clientY)
	});

	function keydown(event)
	{
		if (listen.includes(event.code)) {inputs[event.code]=1}
	}
	function keyup(event)
	{
		if (listen.includes(event.code)) {inputs[event.code]=0}
	}

	const canvas = new Canvas(new vec2(20), 20, "canvas")

	let bodies = []
	bodies.push
	(new object(
		bodies.length, SHAPE.rect, 1,
		new vec2(1, 1), new vec2(0, 0),
		new vec2(0, 0), "chartreuse"
	))
	bodies.push
	(new object(
		bodies.length, SHAPE.circle, 1,
		new vec2(1, 1), new vec2(3, 6),
		new vec2(0, 0), "red"
	))
	//bodies.push
	//(new object(
	//	bodies.length, SHAPE.rect, 1,
	//	new vec2(1, 1), new vec2(4, 5),
	//	new vec2(0, 0), "cyan"
	//))

	function frame()
	{
		bodies[0].vel.x = (inputs["KeyD"]-inputs["KeyA"])*2
		bodies[0].vel.y = (inputs["KeyS"]-inputs["KeyW"])*2
		canvas.clear()
		for (let body of bodies)
		{
			if (!body.vel.isZero())
			{
				move_and_collide(body, [...bodies])
			}
			canvas.draw(body.shape, body.color, body.size, body.pos)
		}
	}
	canvas.clear()
	for (let body of bodies)
	{
		canvas.draw(body.shape, body.color, body.size, body.pos)
	}
	setInterval(frame, interval_fps(fps))
}

const SHAPE =
{
	rect: 0,
	circle: 1
}

class vec2
{
	constructor(x, y=null)
	{
		this.x = x;
		this.y = y !== null ? y : x;
	}
	isZero()
	{
		return this.x === 0 && this.y === 0
	}
	magnitude()
	{
		return Math.sqrt(Math.pow(this.x ,2) + Math.pow(this.y, 2))
	}
	normalized()
	{
		return this.div(this.magnitude())
	}
	abs()
	{
		return new vec2(Math.abs(this.x), Math.abs(this.y))
	}
	ADD(value = new vec2(0))
	{
		this.x += value.x
		this.y += value.y
	}
	add(value = new vec2(0))
	{
		return new vec2(this.x + value.x, this.y + value.y)
	}
	SUB(value = new vec2(0))
	{
		this.x -= value.x
		this.y -= value.y
	}
	sub(value = new vec2(0))
	{
		return new vec2(this.x - value.x, this.y - value.y)
	}
	DIV(value = new vec2(0))
	{
		if (value.x === undefined)
		{
			value = new vec2(value)
		}
		this.x /= value.x
		this.y /= value.y
	}
	div(value = new vec2(0))
	{
		if (value.x === undefined)
		{
			value = new vec2(value)
		}
		return new vec2(this.x / value.x, this.y / value.y)
	}
		MUL(value = new vec2(0))
	{
		if (value.x === undefined)
		{
			value = new vec2(value)
		}
		this.x *= value.x
		this.y *= value.y
	}
	mul(value = new vec2(0))
	{
		if (value.x === undefined)
		{
			value = new vec2(value)
		}
		return new vec2(this.x * value.x, this.y * value.y)
	}
}

class object
{
	constructor
	(
		index = 0, shape = SHAPE.rect, weight=1,
		size = new vec2(1, 1), pos = new vec2(0, 0),
		vel = new vec2(0, 0), color = "white"
	)
	{
		this.index = index
		this.shape = shape
		this.weight = weight
		this.size = size
		this.pos = pos
		this.vel = vel
		this.color = color
	}
}

class Canvas
{
	constructor
	(
		size = new vec2(0, 0),
		cell_size = 0,
		id = ""
	)
	{
		this.size = size
		this.cell_size = cell_size

		const html_obj = document.getElementById(id);
		html_obj.height = cell_size*size.y;
		html_obj.width = cell_size*size.x;

		this.context = html_obj.getContext("2d");
	}

	draw(shape = SHAPE.rect, color="", size=new vec2(0, 0), pos=new vec2(0, 0))
	{
		this.context.fillStyle=color;
		if (shape === SHAPE.rect)
		{
			this.context.fillRect
			(
				pos.x*this.cell_size,
				pos.y*this.cell_size,
				size.x*this.cell_size,
				size.y*this.cell_size
			);
		}
		else if (shape === SHAPE.circle)
		{
			let radius = size.x*this.cell_size/2;
			this.context.beginPath();
			this.context.arc
			(
				pos.x*this.cell_size+radius,
				pos.y*this.cell_size+radius,
				radius, 0, Math.PI * 2, true
			);
			this.context.fill();
		}
	}
	clear()
	{
		this.context.fillStyle="#151515";
		this.context.fillRect
		(
			0, 0,
			this.size.x*this.cell_size,
			this.size.y*this.cell_size
		);
	}
}

function interval_fps(value)
{
	return 1000/value
}

function in_range_co(num, start, end)
{
	return start <= num && num < end
}

function in_range_oc(num, start, end)
{
	return start < num && num <= end
}
function find_closest(p1, p2, target, addition=false)
{
	if (addition) {p2+=p1}
	let out = [p1, p2]
	return out[Number(Math.abs(p1-target)>(p2-target))]
}

/*function in_range_oo(num, start, end)
{
	return start < num && num < end
}
function range_in_range(s1, e1, s2, e2, additon)
{
	if (additon)
	{
		e1 += s1
		e2 += s2
	}
	console.log("rir", s1, "|", e1, "|", s2, "|", e2)
	return in_range_oo(s1, s2, e2) || in_range_oo(e2, s2, e2)
}*/

function calculate_1D_r2r_displacement
(
	bPos, bSize, cPos,
	cSize, velocity
)
{
	overlap_right = in_range_oc(bPos+bSize, cPos, cPos+cSize) ?
		bPos+bSize-cPos: 0
	overlap_left = in_range_co(bPos, cPos, cPos+cSize) ?
		bPos-cPos-cSize : 0
	if (overlap_right > 0 && overlap_left < 0)
	{
		return velocity < 0 ?
			overlap_left : overlap_right
	}
	else
	{
		return overlap_right > 0 ?
			overlap_right : overlap_left
	}
}

function calculate_2D_r2r_displacement(body, collider, last_pos)
{
	let displacement = new vec2(0)
	let is_sliding = new vec2(0)
	displacement.x=calculate_1D_r2r_displacement
	(
		body.pos.x, body.size.x, collider.pos.x,
		collider.size.x, body.vel.x
	)
	is_sliding.x=calculate_1D_r2r_displacement
	(
		last_pos.x, body.size.x, collider.pos.x,
		collider.size.x, body.vel.x
	)
	displacement.y=calculate_1D_r2r_displacement
	(
		body.pos.y, body.size.y, collider.pos.y,
		collider.size.y, body.vel.y
	)
	is_sliding.y=calculate_1D_r2r_displacement
	(
		last_pos.y, body.size.y, collider.pos.y,
		collider.size.y, body.vel.y
	)
	let displacement_x_copy = displacement.x
	displacement.x = !is_sliding.x && body.vel.x != 0 && displacement.y !=0 ?
		displacement.x : 0
	displacement.y = !is_sliding.y && body.vel.y != 0 && displacement_x_copy !=0 ?
		displacement.y : 0
	return displacement
}

function move_and_collide(body, colliders)
{
	let last_pos = body.pos.add(new vec2(0))
	body.pos.ADD(body.vel.div(fps))
	colliders.splice(body.index, 1)
	let final_displacement = new vec2(0)
	for (let collider of colliders)
	{
		let displacement
		if (body.shape+collider.shape==SHAPE.rect*2)
		{
			displacement = calculate_2D_r2r_displacement(body, collider, last_pos)	
		}
		else if (body.shape === SHAPE.rect && collider.shape === SHAPE.circle)
		{
			let closest = new vec2(0)
			closest.x = find_closest(body.pos.x, body.size.x, collider.pos.x+(collider.size.x/2), true)
			closest.y = find_closest(body.pos.y, body.size.y, collider.pos.y+(collider.size.x/2), true)
			displacement = new vec2(0)
			let distance = closest.x-collider.pos.x-(collider.size.x/2)
			if (Math.abs(distance)<collider.size.x/2) {displacement.x = -distance/2}
			distance = closest.y-collider.pos.y-(collider.size.x/2)
			if (Math.abs(distance)<collider.size.y/2) {displacement.y = -distance/2}
			if (displacement.x === 0 || displacement.y === 0)
			{
				displacement = new vec2(0)
			}
			else
			{
				console.log(displacement)
				displacement.MUL(body.vel.normalized().abs())
				console.log(body.vel.normalized().abs())
				console.log(displacement)
				console.log("----------------------------------")
			}
		}

		if (Math.abs(displacement.y) > Math.abs(final_displacement.y))
		{
			final_displacement.y = displacement.y
		}
		if (Math.abs(displacement.x) > Math.abs(final_displacement.x))
		{
			final_displacement.x = displacement.x
		}
	}
	body.pos.SUB(final_displacement)
}