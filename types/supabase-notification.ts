export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      announcements: {
        Row: {
          created_at: string
          id: string
          message: string
          subject: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          subject: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          subject?: string
        }
        Relationships: []
      }
      "discord-broadcast": {
        Row: {
          channel: string | null
          index: string
          message: string
          network: number
          processed: boolean | null
          status: string | null
          TTL: string | null
          tx: string
        }
        Insert: {
          channel?: string | null
          index: string
          message: string
          network: number
          processed?: boolean | null
          status?: string | null
          TTL?: string | null
          tx: string
        }
        Update: {
          channel?: string | null
          index?: string
          message?: string
          network?: number
          processed?: boolean | null
          status?: string | null
          TTL?: string | null
          tx?: string
        }
        Relationships: []
      }
      "hermes-counters": {
        Row: {
          blockHeight: number
          bot_name: string
          indexLast: string
          network: number
        }
        Insert: {
          blockHeight?: number
          bot_name: string
          indexLast?: string
          network: number
        }
        Update: {
          blockHeight?: number
          bot_name?: string
          indexLast?: string
          network?: number
        }
        Relationships: []
      }
      "sendgrid-scheduler": {
        Row: {
          address: string
          chain_id: number | null
          created_at: string | null
          dapp: string | null
          dynamic_template_data: Json | null
          email_delivered: boolean
          email_desired: boolean
          expiry: string | null
          index: number
          template_id: string | null
          tx: string
        }
        Insert: {
          address: string
          chain_id?: number | null
          created_at?: string | null
          dapp?: string | null
          dynamic_template_data?: Json | null
          email_delivered?: boolean
          email_desired: boolean
          expiry?: string | null
          index: number
          template_id?: string | null
          tx: string
        }
        Update: {
          address?: string
          chain_id?: number | null
          created_at?: string | null
          dapp?: string | null
          dynamic_template_data?: Json | null
          email_delivered?: boolean
          email_desired?: boolean
          expiry?: string | null
          index?: number
          template_id?: string | null
          tx?: string
        }
        Relationships: []
      }
      "tg-juror-subscriptions": {
        Row: {
          juror_address: string
          tg_user_id: number
        }
        Insert: {
          juror_address: string
          tg_user_id: number
        }
        Update: {
          juror_address?: string
          tg_user_id?: number
        }
        Relationships: []
      }
      "tg-juror-subscriptions-staging": {
        Row: {
          created_at: string | null
          juror_address: string
          tg_user_id: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          juror_address: string
          tg_user_id: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          juror_address?: string
          tg_user_id?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      "user-public-messages": {
        Row: {
          address: string
          chain_id: number | null
          created_at: string | null
          dapp: string | null
          id: string
          message: string
          tx: string | null
        }
        Insert: {
          address: string
          chain_id?: number | null
          created_at?: string | null
          dapp?: string | null
          id?: string
          message: string
          tx?: string | null
        }
        Update: {
          address?: string
          chain_id?: number | null
          created_at?: string | null
          dapp?: string | null
          id?: string
          message?: string
          tx?: string | null
        }
        Relationships: []
      }
      "user-settings": {
        Row: {
          address: string
          email: string | null
          push: boolean | null
          telegram: string | null
        }
        Insert: {
          address: string
          email?: string | null
          push?: boolean | null
          telegram?: string | null
        }
        Update: {
          address?: string
          email?: string | null
          push?: boolean | null
          telegram?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_subscribers: {
        Args: {
          vals: string[]
        }
        Returns: {
          juror_address: string
          tg_user_id: number
        }[]
      }
      hello_world: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      tg_users_subscribed_to: {
        Args: {
          vals: string[]
        }
        Returns: {
          juror_address: string
          tg_user_id: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
