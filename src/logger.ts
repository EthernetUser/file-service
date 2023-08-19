import winston from "winston";

const addRenderedMessage = winston.format((info) => {
  if (!info.message) return info;

  const re = /\{(?<valueName>.+?)\}/g;
  const valueNames = [];
  let match = null;
  while ((match = re.exec(info.message))) valueNames.push(match.groups.valueName);

  info.renderedMessage = info.message;
  valueNames.forEach((valueName) => {
    if (info.hasOwnProperty(valueName))
      info.renderedMessage = info.renderedMessage.replace(`{${valueName}}`, JSON.stringify(info[valueName]));
  });

  return info;
});

const logger = winston.createLogger({
  level: "debug",
  defaultMeta: { service: "file-service" },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: "YY-MM-DD HH:MM:SS" }),
        addRenderedMessage(),
        winston.format.printf((info) => {
          return `${info.level} [${info.timestamp}] ${info.renderedMessage}`;
        }),
      ),
    }),
  ],
});

export default {
  create: () => logger,
};
