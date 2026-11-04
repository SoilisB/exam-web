import { Pagination, Skeleton, Space } from "antd";
import { useEffect, useState } from "react";
import { useCustomersProvider } from "../providers/useCustomersProvider";
import { AddCustomerButton } from "./AddCustomerButton";
import { CustomerListItem } from "./CustomerListItem";

const PAGE_SIZE = 10;

export const CustomersList = () => {
  const {
    customers,
    totalCount,
    deleteCustomer,
    createCustomer,
    isLoading,
    load,
  } = useCustomersProvider();
  const [page, setPage] = useState(1);

  useEffect(() => {
    load(page, PAGE_SIZE);
  }, [page]);

  const reload = () => load(page, PAGE_SIZE);

  const handleDelete = (id: string) =>
    deleteCustomer(id).then(() => {
      // Last customer of the page deleted: go back one page
      if (customers.length === 1 && page > 1) setPage(page - 1);
      else reload();
    });

  return (
    <Space orientation="vertical" style={{ padding: ".25rem .5rem" }}>
      <AddCustomerButton
        createCustomer={(input) => createCustomer(input).then(reload)}
      />
      {isLoading ? (
        <Skeleton />
      ) : (
        customers.map((customer) => (
          <CustomerListItem
            key={customer.id}
            customer={customer}
            deleteCustomer={handleDelete}
          />
        ))
      )}
      <Pagination
        current={page}
        pageSize={PAGE_SIZE}
        total={totalCount}
        showSizeChanger={false}
        onChange={(newPage) => setPage(newPage)}
      />
    </Space>
  );
};