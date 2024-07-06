import { useEffect, useState } from "react";

const useAppwrite = (fn) => {
  const [data, setData] = useState([]);
  const [isLoading, setisLoading] = useState(false);

  const fetchData = async () => {
    setisLoading(true);
    try {
      const response = await fn();
      setData(response);
    } catch (error) {
      throw new Error(error);
    } finally {
      setisLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const refetch = ()=> fetchData()
  
return{data,isLoading,refetch}};

export default useAppwrite