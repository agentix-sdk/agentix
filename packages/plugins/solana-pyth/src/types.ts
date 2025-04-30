export interface PythPriceFeedIDItem {
    id: string;
    attributes: {
      asset_type: string;
      base: string;
    };
}
  
export interface PythPriceItem {
    binary: {
      data: string[];
      encoding: string;
    };
    parsed: [
      Array<{
        id: string;
        price: {
          price: string;
          conf: string;
          expo: number;
          publish_time: number;
        };
        ema_price: {
          price: string;
          conf: string;
          expo: number;
          publish_time: number;
        };
        metadata: {
          slot: number;
          proof_available_time: number;
          prev_publish_time: number;
        };
      }>,
    ];
}