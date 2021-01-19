#!/usr/bin/env bash

# Run from CSE network or with VPN turned on.

# To start from a specific task, add:
#   --start-at-task START_AT_TASK

ansible-playbook \
  --ask-become-pass \
  --limit production \
  provision.yaml
