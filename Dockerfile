FROM node:20-alpine AS development

WORKDIR /usr/src/app

RUN npm install -g @nestjs/cli

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN npx prisma generate

RUN yarn build

FROM node:20-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
COPY --from=development /usr/src/app/node_modules ./node_modules
COPY --from=development /usr/src/app/dist ./dist
COPY --from=development /usr/src/app/prisma ./prisma
COPY --from=development /usr/src/app/uploads ./uploads
# Устанавливаем только production зависимости
RUN yarn install --production

EXPOSE 3000

CMD ["yarn", "start:prod"]