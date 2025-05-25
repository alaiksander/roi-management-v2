export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      Account: {
        Row: {
          access_token: string | null
          expires_at: number | null
          id: string
          id_token: string | null
          provider: string
          providerAccountId: string
          refresh_token: string | null
          scope: string | null
          session_state: string | null
          token_type: string | null
          type: string
          userId: string
        }
        Insert: {
          access_token?: string | null
          expires_at?: number | null
          id: string
          id_token?: string | null
          provider: string
          providerAccountId: string
          refresh_token?: string | null
          scope?: string | null
          session_state?: string | null
          token_type?: string | null
          type: string
          userId: string
        }
        Update: {
          access_token?: string | null
          expires_at?: number | null
          id?: string
          id_token?: string | null
          provider?: string
          providerAccountId?: string
          refresh_token?: string | null
          scope?: string | null
          session_state?: string | null
          token_type?: string | null
          type?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Account_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      Campaign: {
        Row: {
          budget: number
          clientId: string | null
          createdAt: string
          description: string
          endDate: string
          id: string
          name: string
          startDate: string
          status: string
          updatedAt: string
          userId: string
        }
        Insert: {
          budget: number
          clientId?: string | null
          createdAt?: string
          description: string
          endDate: string
          id: string
          name: string
          startDate: string
          status?: string
          updatedAt: string
          userId: string
        }
        Update: {
          budget?: number
          clientId?: string | null
          createdAt?: string
          description?: string
          endDate?: string
          id?: string
          name?: string
          startDate?: string
          status?: string
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Campaign_clientId_fkey"
            columns: ["clientId"]
            isOneToOne: false
            referencedRelation: "Client"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Campaign_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_campaign_client"
            columns: ["clientId"]
            isOneToOne: false
            referencedRelation: "Client"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_campaign_user"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      Client: {
        Row: {
          address: string | null
          createdAt: string
          email: string
          id: string
          name: string
          notes: string | null
          phone: string | null
          status: string
          totalSpent: number
          updatedAt: string
          userId: string
        }
        Insert: {
          address?: string | null
          createdAt?: string
          email: string
          id: string
          name: string
          notes?: string | null
          phone?: string | null
          status?: string
          totalSpent?: number
          updatedAt: string
          userId: string
        }
        Update: {
          address?: string | null
          createdAt?: string
          email?: string
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          status?: string
          totalSpent?: number
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Client_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_client_user"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      Session: {
        Row: {
          expires: string
          id: string
          sessionToken: string
          userId: string
        }
        Insert: {
          expires: string
          id: string
          sessionToken: string
          userId: string
        }
        Update: {
          expires?: string
          id?: string
          sessionToken?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Session_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      Transaction: {
        Row: {
          amount: number
          campaignId: string | null
          category: string
          clientId: string
          createdAt: string
          date: string
          description: string
          id: string
          notes: string | null
          status: string
          type: string
          updatedAt: string
          userId: string
        }
        Insert: {
          amount: number
          campaignId?: string | null
          category: string
          clientId: string
          createdAt?: string
          date: string
          description: string
          id: string
          notes?: string | null
          status?: string
          type: string
          updatedAt: string
          userId: string
        }
        Update: {
          amount?: number
          campaignId?: string | null
          category?: string
          clientId?: string
          createdAt?: string
          date?: string
          description?: string
          id?: string
          notes?: string | null
          status?: string
          type?: string
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_transaction_campaign"
            columns: ["campaignId"]
            isOneToOne: false
            referencedRelation: "Campaign"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_transaction_client"
            columns: ["clientId"]
            isOneToOne: false
            referencedRelation: "Client"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_transaction_user"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Transaction_campaignId_fkey"
            columns: ["campaignId"]
            isOneToOne: false
            referencedRelation: "Campaign"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Transaction_clientId_fkey"
            columns: ["clientId"]
            isOneToOne: false
            referencedRelation: "Client"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Transaction_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      User: {
        Row: {
          createdAt: string
          email: string
          emailNotifications: boolean
          emailVerified: string | null
          id: string
          image: string | null
          language: string
          marketingEmails: boolean
          name: string | null
          password: string
          role: string
          theme: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          email: string
          emailNotifications?: boolean
          emailVerified?: string | null
          id: string
          image?: string | null
          language?: string
          marketingEmails?: boolean
          name?: string | null
          password: string
          role?: string
          theme?: string
          updatedAt: string
        }
        Update: {
          createdAt?: string
          email?: string
          emailNotifications?: boolean
          emailVerified?: string | null
          id?: string
          image?: string | null
          language?: string
          marketingEmails?: boolean
          name?: string | null
          password?: string
          role?: string
          theme?: string
          updatedAt?: string
        }
        Relationships: []
      }
      VerificationToken: {
        Row: {
          expires: string
          identifier: string
          token: string
        }
        Insert: {
          expires: string
          identifier: string
          token: string
        }
        Update: {
          expires?: string
          identifier?: string
          token?: string
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
