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
      CIDs: {
        Row: {
          cid: string
          estuary: boolean | null
          file_headers: string | null
          threat_detected: boolean | null
          verified: boolean | null
        }
        Insert: {
          cid: string
          estuary?: boolean | null
          file_headers?: string | null
          threat_detected?: boolean | null
          verified?: boolean | null
        }
        Update: {
          cid?: string
          estuary?: boolean | null
          file_headers?: string | null
          threat_detected?: boolean | null
          verified?: boolean | null
        }
        Relationships: []
      }
      "court-v1-metaevidence": {
        Row: {
          arbitrable: string
          chainId: number
          metaEvidenceId: string
          uri: string | null
        }
        Insert: {
          arbitrable: string
          chainId?: number
          metaEvidenceId: string
          uri?: string | null
        }
        Update: {
          arbitrable?: string
          chainId?: number
          metaEvidenceId?: string
          uri?: string | null
        }
        Relationships: []
      }
      "derived-accounts": {
        Row: {
          account: string
          derived: string
        }
        Insert: {
          account: string
          derived: string
        }
        Update: {
          account?: string
          derived?: string
        }
        Relationships: []
      }
      "gnosischain-justifications": {
        Row: {
          created_at: string | null
          disputeIDAndAppeal: string
          id: string
          justification: string
          voteID: number
        }
        Insert: {
          created_at?: string | null
          disputeIDAndAppeal: string
          id: string
          justification: string
          voteID: number
        }
        Update: {
          created_at?: string | null
          disputeIDAndAppeal?: string
          id?: string
          justification?: string
          voteID?: number
        }
        Relationships: []
      }
      historical: {
        Row: {
          block: number | null
          chain_name: string
          contract: string
          event: string
          logIndex: number
          message: Json | null
          project: string | null
          routing_key: string
          timestamp: string | null
          tx: string
        }
        Insert: {
          block?: number | null
          chain_name: string
          contract: string
          event: string
          logIndex: number
          message?: Json | null
          project?: string | null
          routing_key: string
          timestamp?: string | null
          tx: string
        }
        Update: {
          block?: number | null
          chain_name?: string
          contract?: string
          event?: string
          logIndex?: number
          message?: Json | null
          project?: string | null
          routing_key?: string
          timestamp?: string | null
          tx?: string
        }
        Relationships: []
      }
      logbook: {
        Row: {
          dapp: string
          lastSeenBlock: number | null
          network: string | null
          process: string
          unix: number | null
        }
        Insert: {
          dapp: string
          lastSeenBlock?: number | null
          network?: string | null
          process: string
          unix?: number | null
        }
        Update: {
          dapp?: string
          lastSeenBlock?: number | null
          network?: string | null
          process?: string
          unix?: number | null
        }
        Relationships: []
      }
      "mainnet-justifications": {
        Row: {
          created_at: string | null
          disputeIDAndAppeal: string | null
          id: string
          justification: string | null
          voteID: number | null
        }
        Insert: {
          created_at?: string | null
          disputeIDAndAppeal?: string | null
          id: string
          justification?: string | null
          voteID?: number | null
        }
        Update: {
          created_at?: string | null
          disputeIDAndAppeal?: string | null
          id?: string
          justification?: string | null
          voteID?: number | null
        }
        Relationships: []
      }
      "poh-vouchdb": {
        Row: {
          chainId: number
          claimer: string
          expiration: number
          pohId: string
          signature: string
          voucher: string
        }
        Insert: {
          chainId: number
          claimer: string
          expiration: number
          pohId: string
          signature: string
          voucher: string
        }
        Update: {
          chainId?: number
          claimer?: string
          expiration?: number
          pohId?: string
          signature?: string
          voucher?: string
        }
        Relationships: []
      }
      "pohv2-events": {
        Row: {
          chain_name: string
          log_index: number
          tx: string
        }
        Insert: {
          chain_name: string
          log_index: number
          tx: string
        }
        Update: {
          chain_name?: string
          log_index?: number
          tx?: string
        }
        Relationships: []
      }
      "sce-contracts": {
        Row: {
          address: string
          contract: Json | null
          network: string
          project: string | null
        }
        Insert: {
          address: string
          contract?: Json | null
          network: string
          project?: string | null
        }
        Update: {
          address?: string
          contract?: Json | null
          network?: string
          project?: string | null
        }
        Relationships: []
      }
      "sce-heights": {
        Row: {
          height: number
          network: string
        }
        Insert: {
          height: number
          network: string
        }
        Update: {
          height?: number
          network?: string
        }
        Relationships: []
      }
      "sepolia-justifications": {
        Row: {
          created_at: string | null
          disputeIDAndAppeal: string | null
          id: string
          justification: string | null
          voteID: number | null
        }
        Insert: {
          created_at?: string | null
          disputeIDAndAppeal?: string | null
          id: string
          justification?: string | null
          voteID?: number | null
        }
        Update: {
          created_at?: string | null
          disputeIDAndAppeal?: string | null
          id?: string
          justification?: string | null
          voteID?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
