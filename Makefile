#
# Vars
#

BIN = node_modules/.bin/
.DEFAULT_GOAL := all

#
# Tasks
#

validate:
	@${BIN}/standard

test:
	${BIN}/babel-tape-runner test/*.js

all: validate test

.PHONY: validate test