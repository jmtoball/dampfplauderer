#!/bin/node
const SwaggerFakeServer = require('./src/SwaggerFakeServer')
const express = require('express')
const app = express()
new SwaggerFakeServer(app, {uri: process.argv[2]}).run()
