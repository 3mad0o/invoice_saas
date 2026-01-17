import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { storage } from "@/lib/storage";
import { Document, Entity } from "@/lib/types";
import { useEffect, useState } from "react";
import StyledSelect, { Option } from "./ui/StyledSelect";

export function AccountStatement() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<Option | null>(null);

  useEffect(() => {
    setDocuments(storage.getDocuments());
    setEntities(storage.getEntities());
  }, []);

  const entityOptions = entities.map(entity => ({ value: entity.id, label: entity.name }));

  const statementData = documents
    .filter((doc) => doc.entityId === selectedEntity?.value)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((doc) => {
      const isDebit = doc.type === 'invoice';
      return {
        ...doc,
        debit: isDebit ? doc.total : 0,
        credit: !isDebit ? doc.total : 0,
      };
    });

  let runningBalance = 0;
  const statementWithBalance = statementData.map((item) => {
    runningBalance += item.debit - item.credit;
    return {
      ...item,
      balance: runningBalance,
    };
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Account Statement</CardTitle>
        <div className="w-64">
          <StyledSelect
            options={entityOptions}
            value={selectedEntity}
            onChange={setSelectedEntity}
            placeholder="Select a client"
            isClearable
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Debit</TableHead>
              <TableHead className="text-right">Credit</TableHead>
              <TableHead className="text-right">Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedEntity ? (
              statementWithBalance.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell className="text-right">{item.debit > 0 ? item.debit.toFixed(2) : '-'}</TableCell>
                  <TableCell className="text-right">{item.credit > 0 ? item.credit.toFixed(2) : '-'}</TableCell>
                  <TableCell className="text-right">{item.balance.toFixed(2)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Please select a client to view the account statement.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
