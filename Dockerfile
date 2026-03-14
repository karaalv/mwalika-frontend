FROM public.ecr.aws/docker/library/node:22-alpine \
    AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

FROM public.ecr.aws/docker/library/node:22-alpine \
    AS builder
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN npm run build

FROM public.ecr.aws/docker/library/node:22-alpine \
    AS runner
WORKDIR /app
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

ENV HOSTNAME="0.0.0.0"
EXPOSE 3000
CMD ["npm", "start"]
