set dotenv-load := true

# ------------------------------------------------------------------
# Paths / Config
# ------------------------------------------------------------------

root            := justfile_directory()
bin_path        := root / "bin"
tool_path       := root / ".tool"

export PATH := tool_path + ":" + bin_path + ":" + env_var("PATH")

default: check

# -----------------------------
# binny bootstrap + installs
# -----------------------------

# install binny into the tools directory
binny:
    mkdir -p {{tool_path}}
    test -x {{tool_path}}/binny || curl -sSfL https://get.anchore.io/binny | sh -s -- -b {{tool_path}}

# install tools necessary to build the application
tools:
    {{tool_path}}/binny install

update:
    #go get -u all && go mod tidy
    {{tool_path}}/buf dep update

check: binny tools update