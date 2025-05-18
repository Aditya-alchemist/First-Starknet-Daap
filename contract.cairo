#[starknet::interface]
trait ICounterContract<TContractState> {
    fn get_counter(self: @TContractState) -> u32;
    fn increase_counter(ref self: TContractState);
}

#[starknet::contract]
mod counter {
    use starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess};
    use starknet::get_caller_address;
    use starknet::ContractAddress;
   
    #[storage]
    struct Storage {
        counter: u32,
        owner: ContractAddress,
    }

    #[constructor]
    fn constructor(ref self: ContractState, x: u32,owner:ContractAddress ){
        self.counter.write(x);
        self.owner.write(owner);
    }

   #[abi(embed_v0)]
    impl abc of super::ICounterContract<ContractState> {
        fn get_counter(self: @ContractState) -> u32 {
            self.counter.read()
        }

        fn increase_counter(ref self: ContractState) {
            let caller = get_caller_address();
            let owner= self.owner.read();
            assert(caller==owner,'Owner can only call ');
            let current = self.counter.read();
            self.counter.write(current + 1);
        }
    }
}
