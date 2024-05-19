import type { messageTypeResponse } from '../../../../errors';

export const chatMessages = {
  aiConfigNotFound: {
    english: 'Ai config not found',
    portuguese: 'Configuração da ia não foi encontrada'
  },
  noAzureData: {
    english: "This config don't has a Azure Data",
    portuguese: 'Esta configuração não possui p Azure Data'
  },
  noFile: {
    english: "There's no file",
    portuguese: 'Arquivo não encontrado'
  },
  noProject: {
    english: 'Project not found',
    portuguese: 'Projeto não encontrado'
  },
  noQuestions: {
    english: "There's no questions",
    portuguese: 'Não há questões'
  },
  notPermission: (field: messageTypeResponse): messageTypeResponse => ({
    english: `You are not allowed to ${field.english}`,
    portuguese: `Você não tem permissão para ${field.portuguese}`
  })
};
