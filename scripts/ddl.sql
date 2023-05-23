create type status_enum AS ENUM ('OPEN', 'ORDERED');
create table IF NOT EXISTS carts (
	id uuid not null default uuid_generate_v4() primary key,
	user_id uuid not null default uuid_generate_v4(),
	created_at date not null,
	updated_at date not null,
	status status_enum
);

create table IF NOT EXISTS cart_items (
	product_id uuid,
	count integer
);

alter table cart_items
add column cart_id uuid
REFERENCES carts(id)

create table users (
	id uuid primary key default uuid_generate_v4(),
	name text not null,
	email text,
	password text
)

create table orders (
	id uuid primary key default uuid_generate_v4(),
	user_id uuid not null,
	cart_id uuid not null,
	payment json,
	delivery json,
	comments text,
	status text,
	total integer,
	foreign key ("cart_id") references "carts" ("id")
)

create table cart_items (
	CONSTRAINT cart_id FOREIGN KEY (id) REFERENCES carts(id),
	product_id uuid,
	count integer,
)

INSERT INTO carts (id, user_id, created_at, updated_at, status)
values (
    '40e6215d-b5c6-4896-987c-f30f3678f608',
	'40e62153-b5c6-4896-987c-f30f3678f608',
	'2022-04-01',
	'2023-04-01',
	'OPEN'
),
(
    '40e6215d-b5c6-4896-987c-f30f3678f607',
	'fefd3976-b4ed-4351-b4d7-ac974d278992',
	'2022-04-01',
	'2023-04-01',
	'OPEN'
)
(
    '6ecd8c99-4036-403d-bf84-cf8400f67836',
	'5ecd8c99-4036-403d-bf84-cf8400f67836',
	'2022-04-01',
	'2023-04-01',
	'ORDERED'
),
(
    '3f333df6-90a4-4fda-8dd3-9485d27cee36',
	'7f333df6-90a4-4fda-8dd3-9485d27cee36',
	'2022-04-01',
	'2023-04-01',
	'OPEN'
);

INSERT INTO cart_items (cart_id, product_id, count)
values (
    '40e6215d-b5c6-4896-987c-f30f3678f608',
	'40e62153-b5c6-4896-987c-f30f3678f608',
	1
),
(
    '6ecd8c99-4036-403d-bf84-cf8400f67836',
	'5ecd8c99-4036-403d-bf84-cf8400f67836',
	2
),
(
    '3f333df6-90a4-4fda-8dd3-9485d27cee36',
	'7f333df6-90a4-4fda-8dd3-9485d27cee36',
	3
);