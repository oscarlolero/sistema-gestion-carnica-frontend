export const ticketStyles = `
  .ticket-preview {
    width: 52mm;
    font-family: 'Courier New', monospace;
    font-size: 9px;
    line-height: 1.3;
    color: #000;
    background: white;
    border: 1px solid #ddd;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    margin: 0 auto;
  }

  .ticket-content {
    padding: 4mm;
  }

  .ticket-header {
    text-align: center;
    margin-bottom: 8px;
  }

  .ticket-header h1 {
    font-size: 14px;
    font-weight: bold;
    margin: 0 0 2px 0;
    letter-spacing: 1px;
  }

  .ticket-subtitle {
    font-size: 9px;
    margin: 0;
  }

  .ticket-divider {
    margin: 4px 0;
    font-size: 8px;
    overflow: hidden;
  }

  .ticket-info {
    margin: 6px 0;
  }

  .ticket-info p {
    margin: 2px 0;
    font-size: 9px;
  }

  .ticket-info strong {
    font-weight: bold;
  }

  .ticket-items-header {
    display: grid;
    grid-template-columns: 2fr 1fr 1.2fr 1.2fr;
    gap: 2px;
    font-weight: bold;
    font-size: 8px;
    margin-bottom: 2px;
  }

  .ticket-items-header span {
    text-align: right;
  }

  .ticket-items-header span:first-child {
    text-align: left;
  }

  .ticket-item {
    margin: 4px 0;
  }

  .ticket-item-name {
    font-size: 9px;
    font-weight: bold;
    margin-bottom: 2px;
    word-wrap: break-word;
  }

  .ticket-item-details {
    display: grid;
    grid-template-columns: 1fr 1.2fr 1.2fr;
    gap: 2px;
    font-size: 8px;
    text-align: right;
  }

  .ticket-total {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    font-weight: bold;
    margin: 6px 0;
  }

  .ticket-footer {
    text-align: center;
    margin-top: 8px;
    font-size: 9px;
  }

  .ticket-footer p {
    margin: 2px 0;
  }

  .ticket-signature {
    text-align: center;
    margin-top: 8px;
    font-size: 9px;
  }

  .ticket-signature p {
    margin: 4px 0 2px 0;
    font-weight: bold;
  }

  .signature-line {
    border-bottom: 1px solid #000;
    width: 100%;
    height: 20px;
    margin-top: 4px;
  }
`
