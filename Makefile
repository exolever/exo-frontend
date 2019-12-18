#COLORS
GREEN  := $(shell tput -Txterm setaf 2)
WHITE  := $(shell tput -Txterm setaf 7)
YELLOW := $(shell tput -Txterm setaf 3)
RED := $(shell tput -Txterm setaf 1)
RESET  := $(shell tput -Txterm sgr0)

CURRENT_SOURCE_NAME := $(shell git rev-parse --abbrev-ref HEAD | sed "s/\//_/g")

RUN_ARGS := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
$(eval $(RUN_ARGS):;@:)
# Add the following 'help' target to your Makefile
# And add help text after each target name starting with '\#\#'
# A category can be added with @category
HELP_FUN = \
    %help; \
    while(<>) { push @{$$help{$$2 // 'options'}}, [$$1, $$3] if /^([a-zA-Z\-]+)\s*:.*\#\#(?:@([a-zA-Z\-]+))?\s(.*)$$/ }; \
    print "usage: make [target]\n\n"; \
    for (sort keys %help) { \
    print "${WHITE}$$_:${RESET}\n"; \
    for (@{$$help{$$_}}) { \
    $$sep = " " x (32 - length $$_->[0]); \
    print "  ${YELLOW}$$_->[0]${RESET}$$sep${GREEN}$$_->[1]${RESET}\n"; \
    }; \
    print "\n"; }


.PHONY: help dependencies up start stop restart status ps clean

status: check-dependencies ## Show status of containers
	@docker-compose ps $(RUN_ARGS)

pull: check-dependencies ## Pull all containers
	@docker-compose pull $(RUN_ARGS)

up: pull down ## Start all containers in background
	@docker-compose up -d

down: check-dependencies ## Down all containers
	@docker-compose down --remove-orphans $(RUN_ARGS)

destroy: check-dependencies ## Down all containers and volumes
	@docker-compose down -v --remove-orphans $(RUN_ARGS)

logs: check-dependencies ## Show all or <name> containers logs in foreground
	@docker-compose logs -f $(RUN_ARGS)

get-email: check-dependencies ## Get e-mail of the given PK
	@echo "SELECT email FROM accounts_user WHERE id = $(RUN_ARGS);" | docker-compose exec -T backend python3 manage.py dbshell

update-docker-compose: confirm ## Get the latest docker-compose.yml (from master)
	@printf "${YELLOW}Updating docker-compose.yml from master branch.....${RESET}"
	@git archive --format=tar --remote=git\@bitbucket.org:exolever/exo-services.git --prefix=deploy/developers/ master:deploy/developers/ docker-compose.yml | tar xf - && mv deploy/developers/docker-compose.yml . && rm -rf deploy
	@echo "${GREEN}Done${RESET}"

clean: confirm ## Clean all unused container data
	@docker system prune --all --volumes --force

-include .env

.DEFAULT_GOAL := help

help: ##@other Show this help.
	@perl -e '$(HELP_FUN)' $(MAKEFILE_LIST)

confirm:
	@( read -p "$(RED)Are you sure? [y/N]$(RESET): " sure && case "$$sure" in [yY]) true;; *) false;; esac )

check-dependencies:
	@if  ! [ -f .env ]; then echo "Generating nonexisting .env file"; cp .env.dist .env; fi
	@if  ! [ -f docker-compose.yml ]; then echo "Generating nonexisting docker-compose.yml file"; git archive --format=tar --remote=git\@bitbucket.org:exolever/exo-services.git --prefix=deploy/developers/ master:deploy/developers/ docker-compose.yml | tar xf - && mv deploy/developers/docker-compose.yml . && rm -rf deploy; fi
	@echo "Setting TAG=${CURRENT_SOURCE_NAME}"
	@sed -i.bak "s/TAG=.*/TAG=${CURRENT_SOURCE_NAME}/" .env

show-branch:
	@echo ${CURRENT_SOURCE_NAME}
