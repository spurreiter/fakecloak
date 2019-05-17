#!/bin/bash
openssl genrsa -out private.pem 2048
openssl rsa -in private.pem -RSAPublicKey_out -out public.pem
