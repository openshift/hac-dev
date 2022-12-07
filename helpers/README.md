
## Description

This script helps to setup a development environment for an entire application lifecycle.

### Prerequisites

1. Install the appstudio-staging-ci Github app in your github 
2. Copy the content from `template.env` file and create a new `.env` file and add your values.


### Setup


1. Run the setup script from your root directory and pass your github repository to build.
   ```sh
   helpers/setup.sh https://github.com/your_username_/Project-Name.git
   ```
2. Once the setup is complete, merge your new PR in your repository to trigger a new build pipeline.



