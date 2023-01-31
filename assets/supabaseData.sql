create table if not exists public.restaurants (
    id uuid default uuid_generate_v4() not null,
    name text,
    phone_number text,
    coordinates json,
    address text,
    image text,
    place text,
    description text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone,

    primary key (id)
);

create table if not exists public.tag (
    id uuid default uuid_generate_v4() not null,
    name text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone,

    primary key (id)
);

create table if not exists public.foods (
    id uuid default uuid_generate_v4() not null,
    restaurant_id uuid not null,
    tag_id uuid not null,
    name text,
    price numeric,
    image text,
    description text,
    stripe_food_id text,
    stripe_price_id text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone,

    primary key (id)
);

create table if not exists public.food_rating (
    food_id uuid not null,
    customer_id uuid not null,
    rating numeric,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone,

    primary key (food_id, customer_id)
);

create table if not exists public.stripe_customer (
    stripe_customer_id text not null,
    customer_id uuid not null,
    
    primary key (stripe_customer_id)
);

create table if not exists public.checkout_session (
    id text not null,
    customer_id uuid not null,
    payment_intent_id text,
    payment_status text,
    status text,
    line_items json,
    payment_intent_status text,
    shipping_options json,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    expires_at timestamp with time zone,
    updated_at timestamp with time zone,

    primary key (id)
);

create type weekday_enum as enum ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');
create table if not exists public.operating_hours (
    id uuid default uuid_generate_v4() not null,
    restaurant_id uuid not null,
	weekday weekday_enum,
    start_hour time without time zone,
    end_hour time without time zone,

    primary key (id)
);

-- ================================================================================================================== --
alter table if exists public.foods
    add foreign key (restaurant_id)
    references public.restaurants (id) MATCH simple
    on update no action
    on delete cascade
    not valid;

alter table if exists public.foods
    add foreign key (tag_id)
    references public.tag (id) MATCH simple
    on update no action
    on delete cascade
    not valid;

alter table if exists public.food_rating
    add foreign key (food_id)
    references public.foods (id) MATCH simple
    on update no action
    on delete cascade
    not valid;

alter table if exists public.food_rating
    add foreign key (customer_id)
    references auth.users (id) MATCH simple
    on update no action
    on delete cascade
    not valid;

alter table if exists public.stripe_customer
    add foreign key (customer_id)
    references auth.users (id) MATCH simple
    on update no action
    on delete cascade
    not valid;

alter table if exists public.checkout_session
    add foreign key (customer_id)
    references auth.users (id) MATCH simple
    on update no action
    on delete cascade
    not valid;


alter table if exists public.operating_hours
    add foreign key (restaurant_id)
    references public.restaurants (id) MATCH simple
    on update no action
    on delete cascade
    not valid;

-- ================================================================================================================== --
insert into restaurants (id, name, phone_number, coordinates, address, image, place, description)
    values ('229773be-9a9a-4ffb-8374-5d0e20d441d5', 'Sonho Selvagem', '(XX) XXXXX-XXXX', '{"lat": -18.90149967855578, "lng": -40.07541135622722}', 'Rua Uirapuru 9, Jaguaré - Espírito Santo, 29950, Brazil', 'https://images.unsplash.com/photo-1494583882007-bfd2321fb8e2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1452&q=80', 'Jaguaré', 'Temos grande opçôes de lanches e sobremesas para você, fique de olho especialmente em nossos hambúrgueres 👀, são os melhores da região. Sempre adicionaremos novas comidas, aguarde 😋');

insert into restaurants (id, name, phone_number, coordinates, address, image, place, description)
    values ('92ba59c9-6b68-49e3-8e17-8f6d8e56fd3a', 'O sabor da azeitona', '(XX) XXXXX-XXXX', '{"lat": -18.910109586305925, "lng": -40.07093400307956}', 'Rua Maximiniano Laquin Jaguaré - Espírito Santo, 29950, Brazil', 'https://images.unsplash.com/photo-1620876578206-9de0b563a3bc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80', 'Jaguaré', 'Todas as receitas de nossas pizzas contém azeitona, nossas azeitonas são diferenciadas e deixam as pizzas deliciosas 🍕');

insert into restaurants (id, name, phone_number, coordinates, address, image, place, description)
    values ('c7908d6a-f6e9-4cb0-b8e6-f319ad094459', 'O Mercador da meia-noite', '(XX) XXXXX-XXXX', '{"lat": -18.701530197738077, "lng": -39.887549999846435}', 'Rodovia Br 381 São Mateus - Espírito Santo, Brazil', 'https://images.unsplash.com/photo-1499578124509-1611b77778c8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1476&q=80', 'São Mateus', 'Oferecemos apenas bebidas! Para você que pediu comida e não está satisfeito com os preços🤑 das bebidas para acompanhar, aqui você não terá problema, temos os melhores preços!');

insert into restaurants (id, name, phone_number, coordinates, address, image, place, description)
    values ('d110a859-c58e-4cdc-9e3b-a929da68614d', 'A jóia marinha', '(XX) XXXXX-XXXX', '{"lat": -18.918546488413682, "lng": -40.076999315352445}', 'Rua Uirapuru 1771, Jaguaré - Espírito Santo,, Brazil', 'https://images.unsplash.com/photo-1562158079-e4b9ed06b62d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80', 'Jaguaré', 'Entregando um pouco do gosto marinho para você, desfrute dos nossos sabores!');
-- ================================================================================================================== --
insert into operating_hours (restaurant_id, weekday, start_hour, end_hour)
    values ('229773be-9a9a-4ffb-8374-5d0e20d441d5', 'Monday', '9:00:00', '11:00:00');
insert into operating_hours (restaurant_id, weekday, start_hour, end_hour)
    values ('229773be-9a9a-4ffb-8374-5d0e20d441d5', 'Monday', '17:30:00', '22:00:00');
insert into operating_hours (restaurant_id, weekday, start_hour, end_hour)
    values ('229773be-9a9a-4ffb-8374-5d0e20d441d5', 'Tuesday', '17:30:00', '22:00:00');
insert into operating_hours (restaurant_id, weekday, start_hour, end_hour)
    values ('229773be-9a9a-4ffb-8374-5d0e20d441d5', 'Tuesday', '17:30:00', '22:00:00');
insert into operating_hours (restaurant_id, weekday, start_hour, end_hour)
    values ('229773be-9a9a-4ffb-8374-5d0e20d441d5', 'Wednesday', '17:30:00', '22:00:00');
insert into operating_hours (restaurant_id, weekday, start_hour, end_hour)
    values ('229773be-9a9a-4ffb-8374-5d0e20d441d5', 'Wednesday', '17:30:00', '22:00:00');
insert into operating_hours (restaurant_id, weekday, start_hour, end_hour)
    values ('229773be-9a9a-4ffb-8374-5d0e20d441d5', 'Thursday', '17:30:00', '22:00:00');
insert into operating_hours (restaurant_id, weekday, start_hour, end_hour)
    values ('229773be-9a9a-4ffb-8374-5d0e20d441d5', 'Thursday', '17:30:00', '22:00:00');
insert into operating_hours (restaurant_id, weekday, start_hour, end_hour)
    values ('229773be-9a9a-4ffb-8374-5d0e20d441d5', 'Friday', '17:30:00', '22:00:00');
insert into operating_hours (restaurant_id, weekday, start_hour, end_hour)
    values ('229773be-9a9a-4ffb-8374-5d0e20d441d5', 'Friday', '17:30:00', '22:00:00');
insert into operating_hours (restaurant_id, weekday, start_hour, end_hour)
    values ('92ba59c9-6b68-49e3-8e17-8f6d8e56fd3a', 'Monday', '19:30:00', '23:30:00');
insert into operating_hours (restaurant_id, weekday, start_hour, end_hour)
    values ('92ba59c9-6b68-49e3-8e17-8f6d8e56fd3a', 'Tuesday', '19:30:00', '23:30:00');
insert into operating_hours (restaurant_id, weekday, start_hour, end_hour)
    values ('92ba59c9-6b68-49e3-8e17-8f6d8e56fd3a', 'Wednesday', '19:30:00', '23:30:00');
insert into operating_hours (restaurant_id, weekday, start_hour, end_hour)
    values ('92ba59c9-6b68-49e3-8e17-8f6d8e56fd3a', 'Thursday', '19:30:00', '23:30:00');
insert into operating_hours (restaurant_id, weekday, start_hour, end_hour)
    values ('92ba59c9-6b68-49e3-8e17-8f6d8e56fd3a', 'Friday', '19:30:00', '23:30:00');
insert into operating_hours (restaurant_id, weekday, start_hour, end_hour)
    values ('92ba59c9-6b68-49e3-8e17-8f6d8e56fd3a', 'Saturday', '19:30:00', '23:30:00');
insert into operating_hours (restaurant_id, weekday, start_hour, end_hour)
    values ('92ba59c9-6b68-49e3-8e17-8f6d8e56fd3a', 'Sunday', '19:30:00', '23:30:00');
insert into operating_hours (restaurant_id, weekday, start_hour, end_hour)
    values ('c7908d6a-f6e9-4cb0-b8e6-f319ad094459', 'Monday', '22:00:00', '23:59:59');
insert into operating_hours (restaurant_id, weekday, start_hour, end_hour)
    values ('c7908d6a-f6e9-4cb0-b8e6-f319ad094459', 'Tuesday', '22:00:00', '23:59:59');
insert into operating_hours (restaurant_id, weekday, start_hour, end_hour)
    values ('c7908d6a-f6e9-4cb0-b8e6-f319ad094459', 'Wednesday', '22:00:00', '23:59:59');
insert into operating_hours (restaurant_id, weekday, start_hour, end_hour)
    values ('c7908d6a-f6e9-4cb0-b8e6-f319ad094459', 'Thursday', '22:00:00', '23:59:59');
insert into operating_hours (restaurant_id, weekday, start_hour, end_hour)
    values ('c7908d6a-f6e9-4cb0-b8e6-f319ad094459', 'Friday', '22:00:00', '23:59:59');
insert into operating_hours (restaurant_id, weekday, start_hour, end_hour)
    values ('c7908d6a-f6e9-4cb0-b8e6-f319ad094459', 'Saturday', '22:00:00', '23:59:59');
insert into operating_hours (restaurant_id, weekday, start_hour, end_hour)
    values ('c7908d6a-f6e9-4cb0-b8e6-f319ad094459', 'Sunday', '22:00:00', '23:59:59');
insert into operating_hours (restaurant_id, weekday, start_hour, end_hour)
    values ('d110a859-c58e-4cdc-9e3b-a929da68614d', 'Wednesday', '10:30:00', '13:30:00');
insert into operating_hours (restaurant_id, weekday, start_hour, end_hour)
    values ('d110a859-c58e-4cdc-9e3b-a929da68614d', 'Friday', '10:30:00', '13:30:00');
insert into operating_hours (restaurant_id, weekday, start_hour, end_hour)
    values ('d110a859-c58e-4cdc-9e3b-a929da68614d', 'Saturday', '10:30:00', '13:30:00');
insert into operating_hours (restaurant_id, weekday, start_hour, end_hour)
    values ('d110a859-c58e-4cdc-9e3b-a929da68614d', 'Sunday', '10:30:00', '13:30:00');
-- ================================================================================================================== --
insert into tag (id, name)
    values ('8523b6fd-ea35-4939-8487-fc70196f9ea8', 'Hambúrguer');
insert into tag (id, name)
    values ('98a894de-0ca1-48db-96bd-bafc124fe9e2', 'Batata frita');
insert into tag (id, name)
    values ('85f94afb-4269-463b-aec3-06c2b1c8897e', 'Bebida');
insert into tag (id, name)
    values ('c06502b1-2a1a-4cfe-95af-9938b9574fa4', 'Sanduíche');
insert into tag (id, name)
    values ('1df04f44-2d05-4fb5-8154-9de92fd5e15c', 'Cachorro-quente');
insert into tag (id, name)
    values ('e284354d-a740-4af7-8548-9b6bd77be646', 'Sorvete');
insert into tag (id, name)
    values ('9e5a11dd-3351-4283-b207-c760790a9a46', 'Donut');
insert into tag (id, name)
    values ('2711bd9c-e1d2-493f-bf2a-5ead82b1fcc8', 'Pizza');
insert into tag (id, name)
    values ('a8c61040-f8e1-4887-98ec-fb422104f536', 'Frutos do mar');
-- ================================================================================================================================ --
insert into foods (restaurant_id, tag_id, name, price, image, description, stripe_food_id, stripe_price_id)
    values ('229773be-9a9a-4ffb-8374-5d0e20d441d5', '8523b6fd-ea35-4939-8487-fc70196f9ea8', 'Hambúrguer', 18, 'https://images.unsplash.com/photo-1586816001966-79b736744398?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80', 'Pão quentinho com gergelim, carne, alface, tomate, cebola, queijo tipo cheddar, duas fatias finas de bacon e maionese artesanal.', 'id_produto_stripe', 'id_preco_produto_stripe');
insert into foods (restaurant_id, tag_id, name, price, image, description, stripe_food_id, stripe_price_id)
    values ('229773be-9a9a-4ffb-8374-5d0e20d441d5', '98a894de-0ca1-48db-96bd-bafc124fe9e2', 'Batata doce frita',23, 'https://images.unsplash.com/photo-1543352634-99a5d50ae78e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80', 'Uma tigela cheia de batatas crocantes e irresistíveis com um leve toque de limão e maionese para acompanhar.', 'id_produto_stripe', 'id_preco_produto_stripe');
insert into foods (restaurant_id, tag_id, name, price, image, description, stripe_food_id, stripe_price_id)
    values ('229773be-9a9a-4ffb-8374-5d0e20d441d5', '98a894de-0ca1-48db-96bd-bafc124fe9e2', 'Batata Frita', 23, 'https://images.unsplash.com/photo-1630431343545-e9d2e0880487?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80', 'Simplesmente batatas fritas com uma pitada de sal em uma tigela.', 'id_produto_stripe', 'id_preco_produto_stripe');
insert into foods (restaurant_id, tag_id, name, price, image, description, stripe_food_id, stripe_price_id)
    values ('229773be-9a9a-4ffb-8374-5d0e20d441d5', '85f94afb-4269-463b-aec3-06c2b1c8897e', 'Coca cola', 3, 'https://images.unsplash.com/photo-1594971475674-6a97f8fe8c2b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80', 'COCA-COLA SABOR ORIGINAL 250ML.', 'id_produto_stripe', 'id_preco_produto_stripe');
insert into foods (restaurant_id, tag_id, name, price, image, description, stripe_food_id, stripe_price_id)
    values ('229773be-9a9a-4ffb-8374-5d0e20d441d5', 'c06502b1-2a1a-4cfe-95af-9938b9574fa4', 'Sanduíche Plus', 35, 'https://images.pexels.com/photos/1600711/pexels-photo-1600711.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260', 'Porção para quatro pessoas. Cada sanduíche possui carne, tomate, ovo, alface, queijo e fatias de bacon, a porção também vem com batatas fritas', 'id_produto_stripe', 'id_preco_produto_stripe');
insert into foods (restaurant_id, tag_id, name, price, image, description, stripe_food_id, stripe_price_id)
    values ('229773be-9a9a-4ffb-8374-5d0e20d441d5', '1df04f44-2d05-4fb5-8154-9de92fd5e15c', 'Cachorro-quente', 18, 'https://images.pexels.com/photos/4518643/pexels-photo-4518643.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260', 'Servido no famoso pão acompanhado de salsicha, mostarda, ketchup e maionese.', 'id_produto_stripe', 'id_preco_produto_stripe');
insert into foods (restaurant_id, tag_id, name, price, image, description, stripe_food_id, stripe_price_id)
    values ('229773be-9a9a-4ffb-8374-5d0e20d441d5', 'e284354d-a740-4af7-8548-9b6bd77be646', 'Açaí', 39.90, 'https://images.unsplash.com/photo-1554136362-9ce6476bf93a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1364&q=80', 'Açaí de um litro com banana, granola e morango', 'id_produto_stripe', 'id_preco_produto_stripe');
insert into foods (restaurant_id, tag_id, name, price, image, description, stripe_food_id, stripe_price_id)
    values ('229773be-9a9a-4ffb-8374-5d0e20d441d5', '9e5a11dd-3351-4283-b207-c760790a9a46', 'Donuts',11.90, 'https://images.unsplash.com/photo-1527515545081-5db817172677?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80', 'Deliciosos donuts 🍩🍩🍩', 'id_produto_stripe', 'id_preco_produto_stripe');
-- ================================================================================================================================ --
insert into foods (restaurant_id, tag_id, name, price, image, description, stripe_food_id, stripe_price_id)
    values ('92ba59c9-6b68-49e3-8e17-8f6d8e56fd3a', '2711bd9c-e1d2-493f-bf2a-5ead82b1fcc8', 'Pizza', 80, 'https://images.unsplash.com/photo-1602932228690-c08241c46ffa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80', 'Pizza grande com calabresa, mussarela, borda de catupiry e ... muita azeitona😍', 'id_produto_stripe', 'id_preco_produto_stripe');
-- ================================================================================================================================ --
insert into foods (restaurant_id, tag_id, name, price, image, description, stripe_food_id, stripe_price_id)
    values ('d110a859-c58e-4cdc-9e3b-a929da68614d', 'a8c61040-f8e1-4887-98ec-fb422104f536', 'Lagostas grelhadas', 115, 'https://images.unsplash.com/photo-1585546247643-14e9deb7c998?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80', 'Você nunca irá encontrar uma lagosta melhor do que é feita aqui!', 'id_produto_stripe', 'id_preco_produto_stripe');
-- ================================================================================================================================ --
insert into foods (restaurant_id, tag_id, name, price, image, description, stripe_food_id, stripe_price_id)
    values ('c7908d6a-f6e9-4cb0-b8e6-f319ad094459', '85f94afb-4269-463b-aec3-06c2b1c8897e', 'Água', 2.50, 'https://images.unsplash.com/photo-1616118132534-381148898bb4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1528&q=80', 'Simplesmente um litro de 500ml de água', 'id_produto_stripe', 'id_preco_produto_stripe');