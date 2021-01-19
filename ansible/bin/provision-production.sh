#!/usr/bin/env bash

# Run from CSE network or with VPN turned on.

ansible-playbook \
  --ask-become-pass \
  --limit production \
  provision.yaml
