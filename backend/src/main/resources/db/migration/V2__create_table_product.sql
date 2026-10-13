CREATE TABLE product (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    color VARCHAR(50) NOT NULL,
    mark VARCHAR(50) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    category_id BIGINT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_product_category FOREIGN KEY (category_id) REFERENCES category(id)
);