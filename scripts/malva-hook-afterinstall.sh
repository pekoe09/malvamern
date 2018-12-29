#!/bin/bash

echo Running Malva AfterInstall script
cd /home/ubuntu/malva/
npm install
cd /home/ubuntu/malva/client
npm install
echo Finished running Malva AfterInstall script