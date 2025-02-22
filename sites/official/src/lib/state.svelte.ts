
class ActiveTab {
    state = $state('headless-core')

    updateState(state: string) {
        this.state = state;
    }
}




export let activeTab = new ActiveTab();