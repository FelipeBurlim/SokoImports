CREATE TABLE product_image (
    id BIGSERIAL PRIMARY KEY,
    url VARCHAR(500) NOT NULL,
    object_key VARCHAR(255) NOT NULL,
    sort_order INT,
    product_id BIGINT NOT NULL,
    CONSTRAINT fk_product_image_product FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE
);