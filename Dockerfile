FROM node

ENV HOME=/home/intellead/intellead-enrich

ENV PORT=3000

COPY app.js package.json $HOME/app/

COPY bin/ $HOME/app/bin

COPY public/stylesheets/ $HOME/app/public/stylesheets

COPY src/ $HOME/app/src

COPY views/ $HOME/app/views

RUN cd $HOME/app && npm install --silent --progress=false --production

EXPOSE 3000

WORKDIR $HOME/app

CMD ["npm", "start"]