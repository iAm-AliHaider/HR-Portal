import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";

// Blockchain Document Management Interfaces
interface BlockchainDocument {
  id: string;
  hash: string;
  title: string;
  type:
    | "contract"
    | "policy"
    | "certification"
    | "performance"
    | "compliance"
    | "legal";
  content_hash: string;
  ipfs_hash?: string;
  blockchain_tx: string;
  smart_contract_address?: string;
  owner: string;
  permissions: DocumentPermission[];
  version: number;
  previous_versions: string[];
  signatures: DigitalSignature[];
  timestamp: string;
  immutable: boolean;
  encryption_key?: string;
  access_logs: AccessLog[];
  verification_status: "verified" | "pending" | "failed";
}

interface DocumentPermission {
  user_id: string;
  role: string;
  permissions: ("read" | "write" | "sign" | "share" | "audit")[];
  granted_by: string;
  granted_at: string;
  expires_at?: string;
}

interface DigitalSignature {
  signer_id: string;
  signer_name: string;
  signature_hash: string;
  timestamp: string;
  certificate_id: string;
  verification_status: "valid" | "invalid" | "expired";
  blockchain_proof: string;
}

interface AccessLog {
  user_id: string;
  action: "viewed" | "downloaded" | "modified" | "signed" | "shared";
  timestamp: string;
  ip_address: string;
  device_info: string;
  blockchain_proof: string;
}

interface SmartContract {
  address: string;
  name: string;
  type:
    | "document_storage"
    | "access_control"
    | "workflow_automation"
    | "compliance_check";
  abi: any[];
  deployed_at: string;
  gas_used: number;
  owner: string;
  functions: ContractFunction[];
}

interface ContractFunction {
  name: string;
  inputs: any[];
  outputs: any[];
  gas_estimate: number;
  description: string;
}

const BlockchainDocsPage: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("documents");
  const [documents, setDocuments] = useState<BlockchainDocument[]>([]);
  const [contracts, setContracts] = useState<SmartContract[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] =
    useState<BlockchainDocument | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [verificationResults, setVerificationResults] = useState<any>(null);

  useEffect(() => {
    fetchBlockchainData();
  }, []);

  const fetchBlockchainData = async () => {
    try {
      setLoading(true);
      // In production, these would connect to actual blockchain networks
      const [docsData, contractsData] = await Promise.all([
        fetch("/api/blockchain/documents").catch(() => ({ ok: false })),
        fetch("/api/blockchain/contracts").catch(() => ({ ok: false })),
      ]);

      // Using mock data for demonstration
      setDocuments(generateMockDocuments());
      setContracts(generateMockContracts());
    } catch (error) {
      console.error("Failed to fetch blockchain data:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockDocuments = (): BlockchainDocument[] => [
    {
      id: "doc_001",
      hash: "0xa1b2c3d4e5f6789012345678901234567890abcdef",
      title: "Employee Handbook v3.2",
      type: "policy",
      content_hash: "QmX7Y8Z9A1B2C3D4E5F6789012345678901234567890",
      ipfs_hash: "QmX7Y8Z9A1B2C3D4E5F6789012345678901234567890",
      blockchain_tx: "0x123456789abcdef0123456789abcdef0123456789abcdef",
      smart_contract_address: "0xABCDEF123456789012345678901234567890ABCD",
      owner: "hr_admin",
      permissions: [
        {
          user_id: "all_employees",
          role: "employee",
          permissions: ["read"],
          granted_by: "hr_admin",
          granted_at: "2024-01-01T00:00:00Z",
        },
      ],
      version: 3,
      previous_versions: ["doc_001_v1", "doc_001_v2"],
      signatures: [
        {
          signer_id: "hr_director",
          signer_name: "Jane Smith",
          signature_hash: "0xsig123456789abcdef",
          timestamp: "2024-01-15T10:00:00Z",
          certificate_id: "cert_001",
          verification_status: "valid",
          blockchain_proof: "0xproof123456",
        },
      ],
      timestamp: "2024-01-15T10:00:00Z",
      immutable: true,
      access_logs: [
        {
          user_id: "emp_001",
          action: "viewed",
          timestamp: "2024-01-16T09:30:00Z",
          ip_address: "192.168.1.100",
          device_info: "Chrome 120.0 / Windows 11",
          blockchain_proof: "0xlog123456",
        },
      ],
      verification_status: "verified",
    },
    {
      id: "doc_002",
      hash: "0xb2c3d4e5f6789012345678901234567890abcdef12",
      title: "Software Engineer Employment Contract",
      type: "contract",
      content_hash: "QmY8Z9A1B2C3D4E5F6789012345678901234567890AB",
      ipfs_hash: "QmY8Z9A1B2C3D4E5F6789012345678901234567890AB",
      blockchain_tx: "0x234567890abcdef1234567890abcdef1234567890abcd",
      smart_contract_address: "0xBCDEF0123456789012345678901234567890BCDE",
      owner: "legal_dept",
      permissions: [
        {
          user_id: "emp_001",
          role: "employee",
          permissions: ["read", "sign"],
          granted_by: "legal_dept",
          granted_at: "2024-01-10T00:00:00Z",
        },
      ],
      version: 1,
      previous_versions: [],
      signatures: [
        {
          signer_id: "emp_001",
          signer_name: "John Doe",
          signature_hash: "0xsig234567890abcdef",
          timestamp: "2024-01-12T14:30:00Z",
          certificate_id: "cert_002",
          verification_status: "valid",
          blockchain_proof: "0xproof234567",
        },
        {
          signer_id: "hr_manager",
          signer_name: "Alice Johnson",
          signature_hash: "0xsig345678901bcdef",
          timestamp: "2024-01-12T15:00:00Z",
          certificate_id: "cert_003",
          verification_status: "valid",
          blockchain_proof: "0xproof345678",
        },
      ],
      timestamp: "2024-01-10T00:00:00Z",
      immutable: true,
      access_logs: [],
      verification_status: "verified",
    },
    {
      id: "doc_003",
      hash: "0xc3d4e5f6789012345678901234567890abcdef123",
      title: "ISO 27001 Compliance Certificate",
      type: "certification",
      content_hash: "QmZ9A1B2C3D4E5F6789012345678901234567890ABC",
      blockchain_tx: "0x345678901abcdef2345678901abcdef2345678901abde",
      owner: "compliance_officer",
      permissions: [
        {
          user_id: "auditors",
          role: "auditor",
          permissions: ["read", "audit"],
          granted_by: "compliance_officer",
          granted_at: "2024-01-05T00:00:00Z",
          expires_at: "2024-12-31T23:59:59Z",
        },
      ],
      version: 1,
      previous_versions: [],
      signatures: [
        {
          signer_id: "certification_body",
          signer_name: "ISO Certification Authority",
          signature_hash: "0xsig456789012cdef",
          timestamp: "2024-01-05T12:00:00Z",
          certificate_id: "cert_iso_001",
          verification_status: "valid",
          blockchain_proof: "0xproof456789",
        },
      ],
      timestamp: "2024-01-05T12:00:00Z",
      immutable: true,
      access_logs: [],
      verification_status: "verified",
    },
  ];

  const generateMockContracts = (): SmartContract[] => [
    {
      address: "0xABCDEF123456789012345678901234567890ABCD",
      name: "DocumentStorage",
      type: "document_storage",
      abi: [],
      deployed_at: "2024-01-01T00:00:00Z",
      gas_used: 2100000,
      owner: "contract_deployer",
      functions: [
        {
          name: "storeDocument",
          inputs: [
            { name: "hash", type: "bytes32" },
            { name: "metadata", type: "string" },
          ],
          outputs: [{ name: "success", type: "bool" }],
          gas_estimate: 150000,
          description: "Store document hash and metadata on blockchain",
        },
        {
          name: "verifyDocument",
          inputs: [{ name: "hash", type: "bytes32" }],
          outputs: [
            { name: "exists", type: "bool" },
            { name: "timestamp", type: "uint256" },
          ],
          gas_estimate: 50000,
          description: "Verify document existence and retrieve timestamp",
        },
      ],
    },
    {
      address: "0xBCDEF0123456789012345678901234567890BCDE",
      name: "AccessControl",
      type: "access_control",
      abi: [],
      deployed_at: "2024-01-01T00:00:00Z",
      gas_used: 1800000,
      owner: "contract_deployer",
      functions: [
        {
          name: "grantAccess",
          inputs: [
            { name: "user", type: "address" },
            { name: "documentId", type: "bytes32" },
          ],
          outputs: [{ name: "success", type: "bool" }],
          gas_estimate: 80000,
          description: "Grant user access to specific document",
        },
        {
          name: "revokeAccess",
          inputs: [
            { name: "user", type: "address" },
            { name: "documentId", type: "bytes32" },
          ],
          outputs: [{ name: "success", type: "bool" }],
          gas_estimate: 60000,
          description: "Revoke user access to specific document",
        },
      ],
    },
  ];

  const verifyDocumentIntegrity = async (document: BlockchainDocument) => {
    try {
      // In production, this would interact with blockchain
      const mockVerification = {
        blockchain_verified: true,
        hash_verified: true,
        signature_verified: true,
        timestamp_verified: true,
        ipfs_verified: document.ipfs_hash ? true : false,
        smart_contract_verified: document.smart_contract_address ? true : false,
      };

      setVerificationResults({
        document_id: document.id,
        ...mockVerification,
        verification_time: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Verification failed:", error);
    }
  };

  const getDocumentTypeIcon = (type: string) => {
    const icons = {
      contract: "📄",
      policy: "📋",
      certification: "🏆",
      performance: "📊",
      compliance: "✅",
      legal: "⚖️",
    };
    return icons[type as keyof typeof icons] || "📄";
  };

  const getVerificationStatusBadge = (status: string) => {
    const colors = {
      verified: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      failed: "bg-red-100 text-red-800",
    };
    return `px-2 py-1 text-xs font-medium rounded-full ${colors[status as keyof typeof colors]}`;
  };

  if (loading) {
    return (
      <Layout title="Blockchain Document Management">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Blockchain Document Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                🔗 Blockchain Document Management
              </h1>
              <p className="text-indigo-100 mt-2">
                Immutable, verifiable, and decentralized document storage with
                smart contract automation
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{documents.length}</div>
              <div className="text-sm text-indigo-100">
                Documents on Blockchain
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">📄</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Documents
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {documents.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Verified</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {
                    documents.filter(
                      (d) => d.verification_status === "verified",
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">📝</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Smart Contracts
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {contracts.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">🔐</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Signatures</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {documents.reduce(
                    (sum, doc) => sum + doc.signatures.length,
                    0,
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: "documents", label: "Documents", icon: "📄" },
              { id: "contracts", label: "Smart Contracts", icon: "📝" },
              { id: "verification", label: "Verification", icon: "🔍" },
              { id: "analytics", label: "Analytics", icon: "📊" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "documents" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Blockchain Documents
              </h2>
              <button
                onClick={() => setShowUploadModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                📤 Upload Document
              </button>
            </div>

            <div className="grid gap-6">
              {documents.map((document) => (
                <div
                  key={document.id}
                  className="bg-white rounded-lg shadow overflow-hidden"
                >
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">
                          {getDocumentTypeIcon(document.type)}
                        </span>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {document.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Version {document.version} • {document.type}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={getVerificationStatusBadge(
                            document.verification_status,
                          )}
                        >
                          {document.verification_status}
                        </span>
                        <button
                          onClick={() => verifyDocumentIntegrity(document)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          🔍 Verify
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-gray-700">
                          Blockchain Hash
                        </p>
                        <p className="text-gray-600 font-mono text-xs break-all">
                          {document.hash}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Transaction</p>
                        <p className="text-gray-600 font-mono text-xs break-all">
                          {document.blockchain_tx}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Timestamp</p>
                        <p className="text-gray-600">
                          {new Date(document.timestamp).toLocaleString()}
                        </p>
                      </div>
                      {document.ipfs_hash && (
                        <div>
                          <p className="font-medium text-gray-700">IPFS Hash</p>
                          <p className="text-gray-600 font-mono text-xs break-all">
                            {document.ipfs_hash}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-700">Owner</p>
                        <p className="text-gray-600">{document.owner}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Signatures</p>
                        <p className="text-gray-600">
                          {document.signatures.length} verified signatures
                        </p>
                      </div>
                    </div>

                    {/* Signatures */}
                    {document.signatures.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-2">
                          Digital Signatures
                        </h4>
                        <div className="space-y-2">
                          {document.signatures.map((signature, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 bg-gray-50 rounded"
                            >
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {signature.signer_name}
                                </p>
                                <p className="text-xs text-gray-600">
                                  {new Date(
                                    signature.timestamp,
                                  ).toLocaleString()}
                                </p>
                              </div>
                              <span
                                className={`px-2 py-1 text-xs rounded ${
                                  signature.verification_status === "valid"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {signature.verification_status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Permissions */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-2">
                        Access Permissions
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {document.permissions.map((permission, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {permission.user_id}:{" "}
                            {permission.permissions.join(", ")}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "contracts" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Smart Contracts
            </h2>
            <div className="grid gap-6">
              {contracts.map((contract, index) => (
                <div key={index} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {contract.name}
                      </h3>
                      <p className="text-gray-600">Type: {contract.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Gas Used</p>
                      <p className="font-semibold">
                        {contract.gas_used.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="font-medium text-gray-700">
                        Contract Address
                      </p>
                      <p className="text-gray-600 font-mono text-sm break-all">
                        {contract.address}
                      </p>
                    </div>

                    <div>
                      <p className="font-medium text-gray-700">Functions</p>
                      <div className="mt-2 space-y-2">
                        {contract.functions.map((func, idx) => (
                          <div
                            key={idx}
                            className="p-3 bg-gray-50 rounded border"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium text-gray-900">
                                  {func.name}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {func.description}
                                </p>
                              </div>
                              <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                                {func.gas_estimate.toLocaleString()} gas
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-500">
                        Deployed:{" "}
                        {new Date(contract.deployed_at).toLocaleDateString()} •
                        Owner: {contract.owner}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "verification" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Document Verification
            </h2>

            {verificationResults && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Verification Results for Document:{" "}
                  {verificationResults.document_id}
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(verificationResults).map(([key, value]) => {
                    if (key === "document_id" || key === "verification_time")
                      return null;

                    return (
                      <div key={key} className="flex items-center space-x-2">
                        <span
                          className={`w-4 h-4 rounded-full ${
                            value ? "bg-green-500" : "bg-red-500"
                          }`}
                        ></span>
                        <span className="text-sm capitalize">
                          {key.replace(/_/g, " ")}
                        </span>
                        <span
                          className={`text-sm font-medium ${
                            value ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {value ? "✓" : "✗"}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    Verified at:{" "}
                    {new Date(
                      verificationResults.verification_time,
                    ).toLocaleString()}
                  </p>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Verification Tools
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Document Hash Verification
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Enter document hash to verify..."
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
                    />
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm">
                      Verify Hash
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bulk Document Verification
                  </label>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm">
                    Verify All Documents
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Blockchain Analytics
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Document Types Distribution */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Document Types
                </h3>
                <div className="space-y-3">
                  {Object.entries(
                    documents.reduce(
                      (acc, doc) => {
                        acc[doc.type] = (acc[doc.type] || 0) + 1;
                        return acc;
                      },
                      {} as Record<string, number>,
                    ),
                  ).map(([type, count]) => (
                    <div
                      key={type}
                      className="flex justify-between items-center"
                    >
                      <div className="flex items-center space-x-2">
                        <span>{getDocumentTypeIcon(type)}</span>
                        <span className="text-sm font-medium capitalize">
                          {type}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${(count / documents.length) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transaction Activity */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {documents.slice(0, 5).map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded"
                    >
                      <span>{getDocumentTypeIcon(doc.type)}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {doc.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(doc.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={getVerificationStatusBadge(
                          doc.verification_status,
                        )}
                      >
                        {doc.verification_status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Blockchain Metrics */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Blockchain Metrics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {documents.reduce(
                      (sum, doc) => sum + doc.signatures.length,
                      0,
                    )}
                  </p>
                  <p className="text-sm text-gray-600">Total Signatures</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {
                      documents.filter(
                        (d) => d.verification_status === "verified",
                      ).length
                    }
                  </p>
                  <p className="text-sm text-gray-600">Verified Documents</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {documents.filter((d) => d.ipfs_hash).length}
                  </p>
                  <p className="text-sm text-gray-600">IPFS Stored</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">
                    {contracts
                      .reduce((sum, contract) => sum + contract.gas_used, 0)
                      .toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Total Gas Used</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BlockchainDocsPage;
