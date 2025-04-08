CREATE TABLE IF NOT EXISTS flags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    country_name VARCHAR(100) NOT NULL,
    image_url VARCHAR(255) NOT NULL
);

INSERT INTO flags (country_name, image_url) VALUES
('Togo', 'https://example.com/flags/togo.png'),
('France', 'https://example.com/flags/france.png');
