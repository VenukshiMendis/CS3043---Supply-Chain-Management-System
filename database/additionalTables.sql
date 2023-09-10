create table cart
	(customer_email  		varchar(255),
	 product_ID				int,
     quantity               int,
     order_ID               int,
     primary key(product_ID,customer_email),
     foreign key (customer_email) references loginuser(user_name),
     foreign key (product_ID) references product(product_ID)
     
     );