export const sendToWhatsApp = (data: Record<string, string>, title: string) => {
  const phoneNumber = '254713955653';
  
  // Format the message
  let message = `*${title}*\n\n`;
  
  Object.entries(data).forEach(([key, value]) => {
    // Convert camelCase to Title Case for better readability
    const label = key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
      
    message += `*${label}:* ${value}\n`;
  });

  // Encode the message
  const encodedMessage = encodeURIComponent(message);
  
  // Create the WhatsApp URL
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  
  // Open in a new tab
  window.open(whatsappUrl, '_blank');
};
