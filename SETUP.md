# Talli Production Setup
***
## Step 1: Application Configuration
Makes sure your configuration files are set up as described in [README.md](https://github.com/tom-hightower/talli/blob/master/README.md) (`secret.config.json` and `config.json`). In `config.json`, the sslEnabled field should be set to true if you want to enable QR scanning in the application (Note that you will also need to enable SSL for the site's domain for this option to work), and the devMode field should be set to false (this causes the application to use the hostURL for server communication instead of localhost).

## Step 2: Copy Directories
Clone the git repository (or copy via ftp) to your server's filesystem under `/var/www/tallivote.com/` (This guide assumes a linux-based server). Note that if you clone the git repository directly you will need to edit your `config.json` and add your `secret.config.json` after cloning.
<br/>
The structure should look like the following:
```
/var/www/
      |--tallivote.com/
            |--client/
                  |...
            |--server/
                  |...
            |--package.json
            |--talli.config.js
```

## Step 3: Create Client Production Build
In the newly created `/var/www/tallivote.com/`, run `npm run update` and then `npm run build`. This ensures that all necessary packages are installed for both the client and server, and then creates a `client/build/` folder that contains a minified, deployable version of the client application.

## Step 4: Nginx Configuration
If nginx is not installed, it can by added with `sudo apt-get install nginx` or by following the [nginx install guide](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-open-source/). Nginx needs to be set up to allow connections to the client and communication between the client and server.  The following is an example overall nginx configuration file, located in `/etc/nginx/nginx.conf`. Note that `tallivote.com` can be replaced with your hostname if using a different hostname, but it should match the name used in `config.json`:
```
user www-data;
worker_processes auto;
pid /run/nginx.pid;
include /etc/nginx/modules-enabled/*.conf

events {
    worker_connections 768;
}
http {
    ##
    # Basic Settings
    ##
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    ##
    # SSL Settings
    ##
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_prefer_server_ciphers on;

    ##
    # Logging Settings
    ##
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    ##
    # Gzip Settings
    ##
    gzip on;

    ##
    # Virtual Host Configs
    ##
    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
}
```
A talli-specific configuration file also needs to be added and named `/etc/nginx/sites-available/tallivote.com`. If SSL is not being used, only the first server block is needed, the port can be changed from 443 to 80, `ssl` can be removed from the listen lines, and the `ssl_certificate` lines can be removed.  If SSL is being used, the `ssl_certificate` and `ssl_certificate_key` lines should point to your ssl certificate pem files.  If you don't already have an ssl certificate, see [generating ssl centificates](https://www.linode.com/docs/security/ssl/install-lets-encrypt-to-create-ssl-certificates/) to generate a free certificate through letsencrypt.
```
server {
    listen 443 default_server ssl;
    listen [::]:443 default_server ssl;
    root /var/www/tallivote.com/client/build;
    index index.html;
    server_name tallivote.com www.tallivote.com;
    location /socket.io/ {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
    }
    location / {
        root /var/www/tallivote.com/client/build;
        index index.html;
        try_files $uri /index.html;
    }
    ssl_certificate /etc/letsencript/live/tallivote.com/fullchain.pem;
    ssl_certificate_key /etc/letsencript/live/tallivote.com/privkey.pem
}
server {
    listen 80 default_server;
    server_name _;
    return 301 https://$host$request_uri;
}
```
Then, a sym-link needs to be created in `/etc/nginx/sites-enabled/` pointing to the above file. This can be achieved through the command `sudo ln -s /etc/nginx/sites-available/tallivote.com /etc/nginx/sites-enabled/tallivote.com.conf`.

## Step 5: Point Domain to Nginx
Point the hostname to your hosted instance. If the server is running on AWS EC2, Route 53 can be used to point the hostname to the EC2 instance (make sure ports 443 and 80 are open in the EC2 console).

## Step 6: Run the Server as a Process
Cd into the top level talli directory (`cd /var/www/tallivote.com/`) and check that pm2 is installed by running `pm2 list`. If the command is not found, try running `sudo npm run update` again to ensure that all of talli's dependencies are installed.  If pm2 is found, a message should appear confirming that the PM2 daemon has been spawned.  Run `sudo pm2 start talli.config.js` to start talli as a process on the server.  This allows talli to continue running in the background when you close the terminal.

## Step 7: Test the Connection
Try navigating to your hostname in a browser (note that some of the hosting configuration changes may take some time to take effect). If you see the talli homepage, you are done!  If you get an nginx error page, check the nginx configuration files for typos or syntax errors. If you get a domain parking page, then your domain registrar is probably still working on switching nameservers/name entries. If none of these situations describe your problem, or if you've checked your configuration and it still doesn't work, please open an issue with as much information as possible!
