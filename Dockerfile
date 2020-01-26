FROM ruby:2.6.3
ENV LANG C.UTF-8
RUN apt-get update -qq && apt-get install -y build-essential libpq-dev nodejs
RUN gem install bundler -v 1.17.3
WORKDIR /tmp
ADD Gemfile Gemfile
ADD Gemfile.lock Gemfile.lock
RUN bundle install
ENV APP_HOME /webpack-boiler-template
RUN mkdir -p $APP_HOME
WORKDIR $APP_HOME
ADD . $APP_HOME