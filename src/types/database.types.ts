export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: 'developer' | 'cashier';
          full_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role?: 'developer' | 'cashier';
          full_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role?: 'developer' | 'cashier';
          full_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      currencies: {
        Row: {
          id: string;
          code: string;
          name_ru: string;
          name_en: string;
          is_active: boolean;
          position: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          name_ru: string;
          name_en?: string;
          is_active?: boolean;
          position?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          name_ru?: string;
          name_en?: string;
          is_active?: boolean;
          position?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      exchange_rates: {
        Row: {
          id: string;
          currency_id: string;
          buy_price: number;
          sell_price: number;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          id?: string;
          currency_id: string;
          buy_price: number;
          sell_price: number;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          id?: string;
          currency_id?: string;
          buy_price?: number;
          sell_price?: number;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'exchange_rates_currency_id_fkey';
            columns: ['currency_id'];
            referencedRelation: 'currencies';
            referencedColumns: ['id'];
          },
        ];
      };
      exchange_history: {
        Row: {
          id: string;
          currency_id: string;
          old_buy_price: number | null;
          old_sell_price: number | null;
          new_buy_price: number;
          new_sell_price: number;
          changed_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          currency_id: string;
          old_buy_price?: number | null;
          old_sell_price?: number | null;
          new_buy_price: number;
          new_sell_price: number;
          changed_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          currency_id?: string;
          old_buy_price?: number | null;
          old_sell_price?: number | null;
          new_buy_price?: number;
          new_sell_price?: number;
          changed_by?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'exchange_history_currency_id_fkey';
            columns: ['currency_id'];
            referencedRelation: 'currencies';
            referencedColumns: ['id'];
          },
        ];
      };
      roulette_bets: {
        Row: {
          number: number;
          player_id: string | null;
          player_color: string | null;
          is_promo: boolean | null;
          updated_at: string | null;
        };
        Insert: {
          number: number;
          player_id?: string | null;
          player_color?: string | null;
          is_promo?: boolean | null;
          updated_at?: string | null;
        };
        Update: {
          number?: number;
          player_id?: string | null;
          player_color?: string | null;
          is_promo?: boolean | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
