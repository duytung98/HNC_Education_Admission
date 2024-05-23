FROM wyveo/nginx-php-fpm:php81

ARG user
ARG uid

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Create system user to run Composer and Artisan Commands
RUN useradd -G www-data,root -u $uid -d /home/$user $user
RUN mkdir -p /home/$user/.composer && \
    chown -R $user:$user /home/$user

WORKDIR /var/www

# fix ssl
COPY ./openssl.cnf /etc/ssl/openssl.cnf

COPY . .

RUN chown -R $user:$user /var/www
RUN chmod o+w ./storage/ -R
