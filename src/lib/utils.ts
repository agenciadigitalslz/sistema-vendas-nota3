// Função simplificada para substituir clsx e twMerge
export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

// Função para formatar a data e hora no formato DD.MM.YYYY_HH:MM (timezone Brasil)
export function formatDateTime(isoString: string): string {
  try {
    // Criar data no timezone do Brasil (GMT-3)
    const date = new Date(isoString);
    
    // Obter componentes da data no timezone do Brasil
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    // Converter para timezone Brasil (GMT-3)
    const brazilTime = new Date(date.getTime() - 3 * 60 * 60 * 1000);
    const hours = brazilTime.getUTCHours().toString().padStart(2, '0');
    const minutes = brazilTime.getUTCMinutes().toString().padStart(2, '0');
    
    // Retornar no formato DD.MM.YYYY_HH:MM
    return `${day}.${month}.${year}_${hours}:${minutes}`;
  } catch (error) {
    console.error("Erro ao formatar data:", error);
    return isoString;
  }
}
