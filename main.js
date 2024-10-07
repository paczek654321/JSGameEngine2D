/*
ToDo
- don't displace an object if its position before the application of velocity was within colliders bounds on an axis
- change variable and function names to be easier to read
- add some comments
*/

const fps = 60

window.onload = () =>
{
	const canvas = new Canvas(new vec2(20), 20, "canvas")

	let bodies = []
	bodies.push
	(new object(
		bodies.length, SHAPE.rect, 1,
		new vec2(1, 1), new vec2(0, 0),
		new vec2(1, 2), "lime"
	))
	bodies.push
	(new object(
		bodies.length, SHAPE.rect, 1,
		new vec2(1, 1), new vec2(3, 6),
		new vec2(0, 0), "red"
	))

	function frame()
	{
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
		if (!value.x)
		{
			value = new(vec2(value))
		}
		this.x /= value.x
		this.y /= value.y
	}
	div(value = new vec2(0))
	{
		if (!value.x)
		{
			value = new vec2(value)
		}
		return new vec2(this.x / value.x, this.y / value.y)
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

function calculate_1D_displacement
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

function calculate_2D_r2r_displacement(body, collider)
{
	let displacement = new vec2(0)
	displacement.x =calculate_1D_displacement
	(
		body.pos.x, body.size.x, collider.pos.x,
		collider.size.x, body.vel.x
	)
	displacement.y=calculate_1D_displacement
	(
		body.pos.y, body.size.y, collider.pos.y,
		collider.size.y, body.vel.y
	)
	let displacement_x_copy = displacement.x
	displacement.x = body.vel.x != 0 && displacement.y !=0 ?
		displacement.x : 0
	displacement.y = body.vel.y != 0 && displacement_x_copy !=0 ?
		displacement.y : 0
	return displacement
}

function move_and_collide(body, colliders)
{
	body.pos.ADD(body.vel.div(fps))
	colliders.splice(body.index, 1)
	let final_displacement = new vec2(0)
	for (let collider of colliders)
	{
		let displacement = calculate_2D_r2r_displacement(body, collider)
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