#!/bin/bash

if [ "$(id -u)" -ne 0 ]; then 
    echo "This script must run as root." >&2
    exit 1
fi

killall node || echo 'Process was not running, beginning startup.' >&2
sleep 1
npm start